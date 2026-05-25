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
            currentRecording.stop();
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
      recording.stop();
      // wait a tiny bit to ensure file is finalized
      await new Promise(resolve => setTimeout(resolve, 50));
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

      const prompt = `You are a strict, objective language teacher evaluating pronunciation. 

Target phrase: "${targetText}"
Language: "${langCode}"

TASK: Listen to the audio and transcribe exactly what you hear. Then grade the pronunciation out of 100.

STRICT RULES:
1. FIRST, determine if there is any human speech in the audio. If it is mostly silence, static, background noise, or breathing, set "speechDetected" to false.
2. If "speechDetected" is false, you MUST set "score" to 0 and "transcription" to "". DO NOT HALLUCINATE OR GUESS.
3. If "speechDetected" is true, evaluate how closely the spoken words match the target phrase.
4. If the user speaks completely different words than the target phrase, score MUST be 0.
5. Do not just assume the user said the target phrase. Transcribe exactly what is in the audio.

Respond with ONLY a valid JSON object matching this exact structure:
{
  "speechDetected": true, // false if silence or noise
  "transcription": "What was actually spoken in the audio",
  "score": 85, // 0 to 100
  "feedback": "One short sentence in English of feedback."
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
        const assemblyKey = process.env.EXPO_PUBLIC_ASSEMBLY_AI_API_KEY;
        if (assemblyKey && recordingUri) {
          console.warn("Gemini failed. Falling back to AssemblyAI transcription...");
          try {
            // Upload to AssemblyAI
            const uploadRes = await FileSystem.uploadAsync("https://api.assemblyai.com/v2/upload", recordingUri, {
              httpMethod: "POST",
              headers: {
                Authorization: assemblyKey,
              },
            });
            const uploadUrl = JSON.parse(uploadRes.body).upload_url;

            // Transcribe
            // Map common language codes (AssemblyAI uses 'en', 'es', 'fr', etc.)
            let mappedLang = langCode.slice(0, 2).toLowerCase();
            const supportedLanguages = ["en", "es", "fr", "de", "it", "pt", "nl", "hi", "ja", "zh", "fi", "ko", "pl", "ru", "tr", "uk", "vi"];
            if (!supportedLanguages.includes(mappedLang)) {
               mappedLang = "en"; // default to english if not supported by AssemblyAI
            }

            const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
              method: "POST",
              headers: {
                Authorization: assemblyKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                audio_url: uploadUrl,
                language_code: mappedLang,
              }),
            });
            const transcriptData = await transcriptRes.json();
            const transcriptId = transcriptData.id;

            // Poll for completion
            let status = transcriptData.status;
            let finalTranscription = "";
            let attempts = 0;
            while (status !== "completed" && status !== "error" && attempts < 15) {
              await new Promise(resolve => setTimeout(resolve, 1500));
              const checkRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: { Authorization: assemblyKey },
              });
              const checkData = await checkRes.json();
              status = checkData.status;
              if (status === "completed") {
                finalTranscription = checkData.text || "";
              }
              attempts++;
            }

            if (status !== "completed") {
              throw new Error("AssemblyAI transcription failed or timed out.");
            }

            // Simple Levenshtein grading
            const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
            const t1 = normalize(targetText);
            const t2 = normalize(finalTranscription);
            
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
            let score = 0;
            if (longer > 0) {
              const similarity = (longer - editDistance(t1, t2)) / longer;
              score = Math.floor(similarity * 100);
            } else {
               score = 0;
            }

            const isSpeechDetected = finalTranscription.trim().length > 0;
            if (!isSpeechDetected) {
               score = 0;
            }

            const fallbackResult: PronunciationResult = {
              transcription: finalTranscription,
              score: score,
              feedback: score > 80 ? "Great pronunciation!" : "Keep practicing, you'll get it!",
            };

            set({ isEvaluating: false, evaluationResult: fallbackResult });
            return fallbackResult;

          } catch (err: any) {
            console.error("AssemblyAI fallback failed:", err.message);
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

      const parsedResult: PronunciationResult = JSON.parse(textResult.trim());
      set({ isEvaluating: false, evaluationResult: parsedResult });
      return parsedResult;

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
          recording.stop();
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
