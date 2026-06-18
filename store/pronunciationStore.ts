import { create } from "zustand";
import { AudioModule, requestRecordingPermissionsAsync, setAudioModeAsync, RecordingPresets } from "expo-audio";
import type { AudioRecorder } from "expo-audio";
import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system/legacy";

export interface PronunciationResult {
  transcription: string;
  score: number;
  feedback: string;
  isFallback?: boolean;
}

interface PronunciationState {
  isRecording: boolean;
  recording: AudioRecorder | null;
  recordingUri: string | null;
  recordingStartTime: number | null;
  isEvaluating: boolean;
  evaluationResult: PronunciationResult | null;
  error: string | null;
  
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  evaluateAudio: (targetText: string, langCode: string) => Promise<PronunciationResult>;
  playTargetSpeech: (text: string, langCode: string) => Promise<void>;
  resetSpeechState: () => Promise<void>;
}

// Convert ISO language codes or customized codes to expo-speech format
const getSpeechLangCode = (langCode: string): string => {
  switch (langCode.toLowerCase()) {
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    case "ja":
      return "ja-JP";
    default:
      return langCode;
  }
};

const getLanguageName = (langCode: string): string => {
  switch (langCode.toLowerCase().split("-")[0]) {
    case "es":
      return "Spanish";
    case "fr":
      return "French";
    case "ja":
      return "Japanese";
    default:
      return "the target language";
  }
};

export const usePronunciationStore = create<PronunciationState>((set, get) => ({
  isRecording: false,
  recording: null,
  recordingUri: null,
  recordingStartTime: null,
  isEvaluating: false,
  evaluationResult: null,
  error: null,

  startRecording: async () => {
    try {
      // Defensively stop any existing recording first
      const currentRecording = get().recording;
      if (currentRecording) {
        try {
          if (currentRecording.isRecording) {
            await currentRecording.stop();
          }
        } catch (e) {}
      }

      set({ error: null, evaluationResult: null, recordingStartTime: null });
      
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Permission to access microphone was denied");
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Prepare and start recording in high quality (M4A format on both platforms)
      const recording = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
      await recording.prepareToRecordAsync();
      recording.record();
      
      set({ recording, isRecording: true, recordingStartTime: Date.now() });
    } catch (err: any) {
      console.error("Failed to start recording:", err);
      set({ error: err.message || "Failed to start recording" });
    }
  },

  stopRecording: async () => {
    const { recording, isRecording } = get();
    if (!recording || !isRecording) return null;

    try {
      set({ isRecording: false });
      await recording.stop();
      const uri = recording.uri;
      
      // Reset audio mode so playback can work properly on iOS speaker
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      set({ recordingUri: uri || null, recording: null });
      return uri || null;
    } catch (err: any) {
      console.error("Failed to stop recording:", err);
      set({ error: err.message || "Failed to stop recording", recording: null, isRecording: false });
      return null;
    }
  },

  evaluateAudio: async (targetText: string, langCode: string) => {
    const { recordingUri, recordingStartTime } = get();
    if (!recordingUri) {
      const errorMsg = "No audio recording found to evaluate.";
      set({ error: errorMsg });
      throw new Error(errorMsg);
    }

    set({ isEvaluating: true, error: null });

    // Local scoring helper
    const computePronunciationScore = (target: string, actual: string): number => {
      const normalize = (s: string) => s.normalize("NFKC").toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
      const t1 = normalize(target);
      const t2 = normalize(actual);
      
      const editDistance = (s1: string, s2: string) => {
        const costs: number[] = [];
        for (let i = 0; i <= s1.length; i++) {
          let lastValue = i;
          for (let j = 0; j <= s2.length; j++) {
            if (i === 0) costs[j] = j;
            else if (j > 0) {
              let newValue = costs[j - 1];
              if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
              }
              costs[j - 1] = lastValue;
              lastValue = newValue;
            }
          }
          if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
      };

      const longer = Math.max(t1.length, t2.length);
      if (longer === 0) return 0;
      const similarity = (longer - editDistance(t1, t2)) / longer;
      return Math.floor(similarity * 100);
    };

    try {
      // Check duration to see if they spoke at all
      const duration = recordingStartTime ? (Date.now() - recordingStartTime) : 0;
      if (duration < 1200) {
        throw new Error("DURATION_TOO_SHORT");
      }

      // 1. Read the audio file as a base64 string
      const base64Audio = await FileSystem.readAsStringAsync(recordingUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 2. Prepare API keys
      const keys = [
        process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        process.env.EXPO_PUBLIC_GEMINI_API_KEY_BACKUP,
      ].filter(Boolean) as string[];

      if (keys.length === 0) {
        console.warn("Gemini API key is not configured. Falling back to local simulation.");
        throw new Error("API_KEY_MISSING");
      }

      const prompt = `You are a strict and highly accurate AI audio transcription engine.
Language: "${langCode}"

Your only task is to transcribe exactly what is spoken in the audio.

ANTI-HALLUCINATION RULES:
1. Listen carefully. If the audio is mostly silence, background noise, static, or breathing, you MUST set "speechDetected" to false and "transcription" to "".
2. Do not guess or make up words. Transcribe ONLY what you actually hear.

Respond ONLY with a JSON object. No markdown formatting.
{
  "speechDetected": true, // false if silence, noise, or unintelligible
  "transcription": "The exact words spoken in the audio, or empty string"
}`;

      let lastError: any = null;
      let textResult = null;

      for (const apiKey of keys) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType: "audio/m4a", // Standard format recorded by expo-av HIGH_QUALITY
                        data: base64Audio,
                      },
                    },
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!textResult) {
            throw new Error("Empty response from Gemini API");
          }

          // If successful, break out of the retry loop
          lastError = null;
          break;
        } catch (err: any) {
          console.warn("API request failed with key, trying next if available:", err.message);
          lastError = err;
        }
      }

      if (lastError && !textResult) {
        const groqKey = process.env.EXPO_PUBLIC_GROK_WHISPER_API;
        const assemblyKey = process.env.EXPO_PUBLIC_ASSEMBLY_AI_API_KEY;
        
        if ((groqKey || assemblyKey) && recordingUri) {
          console.warn("Gemini failed. Falling back to fast transcription...");
          try {
            let finalTranscription = "";
            
            // Try Groq Whisper first (synchronous, ~1 second)
            if (groqKey) {
              try {
                console.log("[pronunciationStore] Using Groq Whisper fallback...");
                let mappedLang = langCode.slice(0, 2).toLowerCase();
                const supportedLanguages = ["en", "es", "fr", "de", "it", "pt", "nl", "hi", "ja", "zh", "fi", "ko", "pl", "ru", "tr", "uk", "vi"];
                if (!supportedLanguages.includes(mappedLang)) mappedLang = "en";

                const formData = new FormData();
                formData.append("file", {
                  uri: recordingUri,
                  type: "audio/m4a",
                  name: "recording.m4a",
                } as any);
                formData.append("model", "whisper-large-v3-turbo");
                // Explicitly specify target language to ensure pronunciation is transcribed in that language (not translated to English)
                formData.append("language", mappedLang);
                formData.append("response_format", "json");

                const groqRes = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
                  method: "POST",
                  headers: { Authorization: `Bearer ${groqKey}` },
                  body: formData,
                });

                if (!groqRes.ok) throw new Error(`Groq error: ${groqRes.status}`);
                const groqData = await groqRes.json();
                finalTranscription = groqData.text || "";
              } catch (groqErr: any) {
                console.warn("[pronunciationStore] Groq failed:", groqErr.message);
                // Fall through to AssemblyAI
              }
            }

            // If Groq didn't produce a result, try AssemblyAI
            if (!finalTranscription && assemblyKey) {
              console.log("[pronunciationStore] Using AssemblyAI fallback...");
              const uploadRes = await FileSystem.uploadAsync("https://api.assemblyai.com/v2/upload", recordingUri, {
                httpMethod: "POST",
                headers: { Authorization: assemblyKey },
              });
              const uploadUrl = JSON.parse(uploadRes.body).upload_url;

              let mappedLang = langCode.slice(0, 2).toLowerCase();
              const supportedLanguages = ["en", "es", "fr", "de", "it", "pt", "nl", "hi", "ja", "zh", "fi", "ko", "pl", "ru", "tr", "uk", "vi"];
              if (!supportedLanguages.includes(mappedLang)) mappedLang = "en";

              const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
                method: "POST",
                headers: {
                  Authorization: assemblyKey,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ audio_url: uploadUrl, language_code: mappedLang }),
              });
              const transcriptData = await transcriptRes.json();
              const transcriptId = transcriptData.id;

              let status = transcriptData.status;
              let attempts = 0;
              while (status !== "completed" && status !== "error" && attempts < 30) {
                if (attempts > 0) await new Promise(r => setTimeout(r, 500));
                const checkRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                  headers: { Authorization: assemblyKey },
                });
                const checkData = await checkRes.json();
                status = checkData.status;
                if (status === "completed") finalTranscription = checkData.text || "";
                attempts++;
              }
              if (status !== "completed") throw new Error("AssemblyAI timed out.");
            }

            const isSpeechDetected = finalTranscription.trim().length > 0;
            let score = 0;
            let feedback = "We couldn't hear recognizable speech.";

            if (isSpeechDetected) {
              score = computePronunciationScore(targetText, finalTranscription);
              if (score >= 80) {
                feedback = "Great pronunciation!";
              } else if (score >= 50) {
                feedback = "Good try! Keep practicing to get it perfect.";
              } else {
                const langName = getLanguageName(langCode);
                feedback = `It sounds like you said "${finalTranscription}" instead of "${targetText}". Make sure you are pronouncing it in ${langName}!`;
              }
            }

            const fallbackResult: PronunciationResult = {
              transcription: finalTranscription,
              score: score,
              feedback: feedback,
            };

            set({ isEvaluating: false, evaluationResult: fallbackResult });
            return fallbackResult;

          } catch (err: any) {
            console.error("Fallback transcription failed:", err.message);
            throw new Error("I am listening to too many students right now! Please take a deep breath, wait about 30 seconds, and try again.");
          }
        }

        console.warn("All Gemini keys failed. Rate limit exceeded.");
        throw new Error("I am listening to too many students right now! Please take a deep breath, wait about 30 seconds, and try again.");
      }

      if (lastError) {
        throw lastError; // This will be caught by the outer catch block
      }

      if (!textResult) {
        throw new Error("Empty response from AI API");
      }

      let cleanJson = textResult.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.substring(7);
      else if (cleanJson.startsWith('```')) cleanJson = cleanJson.substring(3);
      if (cleanJson.endsWith('```')) cleanJson = cleanJson.substring(0, cleanJson.length - 3);
      cleanJson = cleanJson.trim();

      const parsedResult: PronunciationResult & { speechDetected?: boolean } = JSON.parse(cleanJson);
      
      let finalTranscription = parsedResult.transcription || "";
      if (parsedResult.speechDetected === false) {
        finalTranscription = "";
      }

      const isUnintelligible = finalTranscription.trim() === "";
      let score = 0;
      let feedback = "";

      if (isUnintelligible) {
        score = 0;
        finalTranscription = "";
        feedback = "Sorry, I did not catch that. Please speak clearly into the microphone and try again.";
      } else {
        score = computePronunciationScore(targetText, finalTranscription);
        if (score >= 80) {
          feedback = "Great pronunciation!";
        } else if (score >= 50) {
          feedback = "Good try! Keep practicing to get it perfect.";
        } else {
          const langName = getLanguageName(langCode);
          feedback = `It sounds like you said "${finalTranscription}" instead of "${targetText}". Make sure you are pronouncing it in ${langName}!`;
        }
      }

      const finalResult: PronunciationResult = {
        transcription: finalTranscription,
        score,
        feedback,
      };

      set({ isEvaluating: false, evaluationResult: finalResult });
      return finalResult;

    } catch (err: any) {
      if (err.message === "DURATION_TOO_SHORT") {
        const errorMsg = "Recording was too short. Please speak clearly for at least 1.5 seconds.";
        set({ error: errorMsg, isEvaluating: false });
        throw err;
      }

      if (err.message === "API_KEY_MISSING") {
        console.warn("Gemini API key is not configured. Using fallback simulator.");
        // Fallback local simulation in case of missing API keys
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const mockResult: PronunciationResult = {
          transcription: targetText,
          score: Math.floor(Math.random() * 15) + 84,
          feedback: "Demo Mode: Awesome pronunciation! (Set EXPO_PUBLIC_GEMINI_API_KEY for live AI evaluation)",
          isFallback: true,
        };
        set({ isEvaluating: false, evaluationResult: mockResult });
        return mockResult;
      }

      console.error("Speech evaluation failed:", err);

      if (err.message && err.message.includes("429")) {
        const rateLimitMsg = "API Rate Limit Exceeded on all keys. Please wait a moment and try again.";
        set({ error: rateLimitMsg, isEvaluating: false });
        throw err;
      }

      const errorResult: PronunciationResult = {
        transcription: "",
        score: 0,
        feedback: "We couldn't hear recognizable speech. Please speak clearly into your microphone.",
      };

      set({ isEvaluating: false, evaluationResult: errorResult });
      return errorResult;
    }
  },

  playTargetSpeech: async (text: string, langCode: string) => {
    try {
      const formattedLang = getSpeechLangCode(langCode);
      
      // Stop any speech currently speaking
      await Speech.stop();
      
      await Speech.speak(text, {
        language: formattedLang,
        rate: 0.85, // Slightly slower speed for clearer listening
      });
    } catch (err: any) {
      console.error("Text to speech failed:", err);
    }
  },

  resetSpeechState: async () => {
    const { recording } = get();
    if (recording) {
      try {
        if (recording.isRecording) {
          await recording.stop();
        }
      } catch (e) {
        // Already stopped
      }
    }
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
    } catch (e) {}

    set({
      isRecording: false,
      recording: null,
      recordingUri: null,
      recordingStartTime: null,
      isEvaluating: false,
      evaluationResult: null,
      error: null,
    });
  },
}));
