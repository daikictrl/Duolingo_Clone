import * as FileSystem from "expo-file-system/legacy";

interface ChatMessage {
  role: "ai" | "user";
  text: string;
}

export interface TeacherResponse {
  teachingText?: string;
  practicePrompt?: string;
  feedback?: string;
  score?: number;
  translation: string;
  phase: "teaching" | "practicing" | "assessing";
}

export async function generateTeacherResponse(
  languageName: string,
  history: ChatMessage[],
  round: number,
  userTranscription?: string
): Promise<TeacherResponse> {
  const openaiKey = process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY;

  if (!openaiKey) {
    throw new Error("No AI API keys configured.");
  }

  const historyText = history
    .map((msg) => `${msg.role === "user" ? "User" : "Teacher"}: ${msg.text}`)
    .join("\n");

  const lang = languageName;

  let phaseInstruction = "";
  if (userTranscription !== undefined) {
    phaseInstruction = `The user responded with: "${userTranscription}".
PHASE: Assess and Feedback.
1. Evaluate their pronunciation. Give a score 0-100 per the grading policy.
2. Write encouraging feedback in English (1-2 sentences).
3. If round < 3: also teach the next phrase. Put explanation in "teachingText" and the raw ${lang} phrase in "practicePrompt".
4. If round = 3: wrap up warmly (leave "teachingText" and "practicePrompt" empty).`;
  } else if (round === 1 && history.length === 0) {
    phaseInstruction = `PHASE: First Lesson.
1. Greet the user as Vexora, their enthusiastic language teacher.
2. Teach one common, useful ${lang} phrase (not a single word). Explain what it means and give a phonetic pronunciation guide.
3. Put ONLY the raw ${lang} phrase in "practicePrompt" (e.g. "Bonjour, comment allez-vous?"). No English in practicePrompt.`;
  } else {
    phaseInstruction = `PHASE: Teach.
1. Teach a new related ${lang} phrase, building on prior rounds.
2. Explain meaning and pronunciation with a phonetic guide.
3. Put ONLY the raw ${lang} phrase in "practicePrompt". No English in practicePrompt.`;
  }

  const systemPrompt = `You are Vexora, an enthusiastic and supportive AI language teacher. You teach ${lang} to English speakers.

LANGUAGE RULE: Write "teachingText" and "feedback" entirely in English. When introducing a ${lang} phrase, embed it in your English explanation with a phonetic guide.

CRITICAL FIELD REQUIREMENT (VERY IMPORTANT):
- If the current round is less than 3, you MUST teach the next phrase. This means you MUST populate "teachingText" (with an English explanation) and "practicePrompt" (with the raw ${lang} phrase).
- You are NOT allowed to leave "teachingText" or "practicePrompt" empty or null when round < 3, even if the user's score was low or incorrect.
- If the current round is exactly 3 (the final round), you are wrapping up, so leave "teachingText" and "practicePrompt" empty.

CRITICAL "practicePrompt" RULE: The "practicePrompt" field must contain ONLY the raw ${lang} phrase the user should say. No English text, no instructions, no "Now try saying..." — just the phrase itself.
Example: If teaching "How are you?" in French, practicePrompt = "Comment allez-vous?" (NOT "Now try saying 'Comment allez-vous?'")

CRITICAL "translation" RULE: The "translation" field must be written entirely in ${lang}. Translate ALL your English teachingText and feedback into ${lang}. Do NOT put English here.
Example: If teachingText = "Great job! Let's learn 'merci' which means 'thank you'.", then translation = "Bon travail ! Apprenons 'merci' qui signifie 'thank you'."

RESPONSE FORMAT (strict JSON):
{
  "phase": "teaching" | "assessing",
  "teachingText": "English explanation with embedded ${lang} phrases and phonetic pronunciation tips (empty on round 3)",
  "practicePrompt": "The raw ${lang} phrase only, no English (empty on round 3)",
  "feedback": "English feedback on the user's attempt (only when assessing)",
  "score": 0,
  "translation": "Everything from teachingText and feedback translated into ${lang}"
}

LESSON STYLE: Conversational, lively, like a real voice call. Teach full phrases, not isolated words. When assessing (round < 3), always include the next lesson.

GRADING POLICY:
- Score 0-30: silence, noise, English-only speech, speech in a different language, or completely unrelated speech.
- Score 31-59: partially correct attempt with significant errors.
- Score 60-74: recognizable attempt with minor issues.
- Score 75-100: good attempt. Be forgiving of minor phonetic or transcription quirks.
- Never award 60+ for silence, English-only responses, or responses in a different language than ${lang}.
- If the user spoke English or another language instead of the target language, give a score of 0-30 and tell them (in English feedback) what they should say in ${lang} instead.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
      "HTTP-Referer": "https://duolingoclone.com",
      "X-Title": "Duolingo Clone",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Round: ${round}.
Current Phase Instruction:
${phaseInstruction}

Conversation History so far:
${historyText}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API Error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const responseText = data.choices?.[0]?.message?.content;
  if (!responseText) {
    throw new Error("Empty response from OpenRouter API");
  }

  const parsed = JSON.parse(responseText.trim());
  return parsed as TeacherResponse;
}

async function transcribeWithGemini(recordingUri: string, languageCode: string): Promise<string> {
  const keys = [
    process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    process.env.EXPO_PUBLIC_GEMINI_API_KEY_BACKUP,
  ].filter(Boolean) as string[];

  if (keys.length === 0) {
    throw new Error("No Gemini keys configured in environment");
  }

  const base64Audio = await FileSystem.readAsStringAsync(recordingUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const prompt = `You are a strict and highly accurate AI audio transcription engine.
Language requested: "${languageCode}"

Your only task is to transcribe exactly what is spoken in the audio without translating it.
If the speaker speaks in a different language than "${languageCode}" (for example, if they speak in English or another language), you MUST transcribe EXACTLY what they say in that other language (e.g. English text, or whatever language was spoken). Do NOT translate it to "${languageCode}". Do NOT translate any English words to "${languageCode}". Transcribe the phonetics/words exactly as spoken.

ANTI-HALLUCINATION RULES:
1. Listen carefully. If the audio is mostly silence, background noise, static, or breathing, you MUST set "speechDetected" to false and "transcription" to "".
2. Do not guess or make up words. Transcribe ONLY what you actually hear.

Respond ONLY with a JSON object. No markdown formatting.
{
  "speechDetected": true, // false if silence, noise, or unintelligible
  "transcription": "The exact words spoken in the audio, or empty string"
}`;

  let lastError: any = null;
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
                    mimeType: "audio/m4a",
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
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResult) {
        throw new Error("Empty response from Gemini API");
      }

      let cleanJson = textResult.trim();
      if (cleanJson.startsWith('```json')) cleanJson = cleanJson.substring(7);
      else if (cleanJson.startsWith('```')) cleanJson = cleanJson.substring(3);
      if (cleanJson.endsWith('```')) cleanJson = cleanJson.substring(0, cleanJson.length - 3);
      cleanJson = cleanJson.trim();

      const parsed = JSON.parse(cleanJson);
      if (parsed.speechDetected === false) {
        return "";
      }
      return parsed.transcription || "";
    } catch (err: any) {
      console.warn(`[transcribeWithGemini] Failed with key ending in ...${apiKey.substring(apiKey.length - 4)}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("All Gemini transcription attempts failed");
}

export async function transcribeTeacherAudio(recordingUri: string, languageCode: string): Promise<string> {
  const startTime = Date.now();
  console.log("[transcribeTeacherAudio] START | languageCode:", languageCode);

  // Try Gemini transcription first to get an exact non-translated transcription
  try {
    console.log("[transcribeTeacherAudio] → Trying Gemini (primary)...");
    const result = await transcribeWithGemini(recordingUri, languageCode);
    console.log(`[transcribeTeacherAudio] ✅ Gemini done in ${Date.now() - startTime}ms | result: "${result}"`);
    return result;
  } catch (geminiErr: any) {
    console.warn("[transcribeTeacherAudio] ⚠️ Gemini failed. Falling back to Whisper/AssemblyAI...", geminiErr.message);
  }

  const groqKey = process.env.EXPO_PUBLIC_GROK_WHISPER_API;
  const assemblyKey = process.env.EXPO_PUBLIC_ASSEMBLY_AI_API_KEY;

  let mappedLang = languageCode.slice(0, 2).toLowerCase();
  const supportedLanguages = ["en", "es", "fr", "de", "it", "pt", "nl", "hi", "ja", "zh", "fi", "ko", "pl", "ru", "tr", "uk", "vi"];
  if (!supportedLanguages.includes(mappedLang)) {
    mappedLang = "en";
  }

  // Primary fallback: Groq Whisper (synchronous, ~1-2 seconds)
  if (groqKey) {
    try {
      console.log("[transcribeTeacherAudio] → Groq Whisper fallback (fast mode)...");
      const result = await transcribeWithGroq(recordingUri, mappedLang, groqKey);
      console.log(`[transcribeTeacherAudio] ✅ Groq done in ${Date.now() - startTime}ms | result: "${result.substring(0, 50)}..."`);
      return result;
    } catch (err: any) {
      console.warn(`[transcribeTeacherAudio] ❌ Groq failed after ${Date.now() - startTime}ms:`, err.message);
    }
  } else {
    console.log("[transcribeTeacherAudio] ⚠️ No Groq key found for fallback");
  }

  // Secondary fallback: AssemblyAI (polling-based)
  if (assemblyKey) {
    console.log("[transcribeTeacherAudio] → AssemblyAI fallback...");
    const result = await transcribeWithAssemblyAI(recordingUri, mappedLang, assemblyKey);
    console.log(`[transcribeTeacherAudio] ✅ AssemblyAI done in ${Date.now() - startTime}ms`);
    return result;
  }

  throw new Error("No transcription API keys configured or all attempts failed (Gemini, Groq, AssemblyAI)");
}

/** Groq Whisper — single synchronous request, no polling */
async function transcribeWithGroq(recordingUri: string, lang: string, apiKey: string): Promise<string> {
  const formData = new FormData();

  // React Native FormData supports {uri, type, name} objects for file uploads
  formData.append("file", {
    uri: recordingUri,
    type: "audio/m4a",
    name: "recording.m4a",
  } as any);
  formData.append("model", "whisper-large-v3-turbo");
  // Explicitly specify target language to ensure pronunciation is transcribed in that language (not translated to English)
  formData.append("language", lang);
  formData.append("response_format", "json");

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq Whisper error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.text || "";
}

/** AssemblyAI fallback — upload + poll */
async function transcribeWithAssemblyAI(recordingUri: string, lang: string, apiKey: string): Promise<string> {
  const uploadRes = await FileSystem.uploadAsync("https://api.assemblyai.com/v2/upload", recordingUri, {
    httpMethod: "POST",
    headers: { Authorization: apiKey },
  });

  const uploadUrl = JSON.parse(uploadRes.body).upload_url;
  if (!uploadUrl) throw new Error(`Upload failed: ${uploadRes.body}`);

  const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ audio_url: uploadUrl, language_code: lang }),
  });

  const transcriptData = await transcriptRes.json();
  const transcriptId = transcriptData.id;
  if (!transcriptId) throw new Error(`Transcription request failed: ${JSON.stringify(transcriptData)}`);

  let status = transcriptData.status;
  let finalTranscription = "";
  let attempts = 0;

  while (status !== "completed" && status !== "error" && attempts < 30) {
    if (attempts > 0) await new Promise((r) => setTimeout(r, 500));
    const checkRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
      headers: { Authorization: apiKey },
    });
    const checkData = await checkRes.json();
    status = checkData.status;
    if (status === "completed") finalTranscription = checkData.text || "";
    attempts++;
  }

  if (status !== "completed") throw new Error(`AssemblyAI timed out. Status: ${status}`);
  return finalTranscription;
}

