interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  translation?: string;
}

interface AIResponse {
  aiText: string;
  translation: string;
  userTranslation?: string;
  userTargetLanguageText?: string;
  suggestions: {
    text: string;
    translation: string;
  }[];
}

export async function fetchAIResponse(
  scenarioTitle: string,
  languageName: string,
  locale: string,
  history: ChatMessage[],
  userInput: string
): Promise<AIResponse> {
  const openaiKey = process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY;

  if (!openaiKey) {
    throw new Error("No AI API keys configured. Running in Demo Mode.");
  }

  // Format conversation history
  const historyText = history
    .map(
      (msg) =>
        `${msg.sender === "user" ? "User" : "Vexora"}: ${msg.text}${
          msg.translation ? ` (${msg.translation})` : ""
        }`
    )
    .join("\n");

  const systemPrompt = `You are Vexora, a friendly and supportive AI language coach on a Duolingo-like language learning app.
You are playing the role of: "${scenarioTitle}".
The target language you must speak in is: "${languageName}" (locale: "${locale}").

Current conversation history:
${historyText}

The user's latest message is: "${userInput}"

Please analyze the user's latest message ("${userInput}") and infer their native/preferred language (e.g., if they write in French, their preferred language is French. If they write in the target language, assume English unless previously established in the history).

- If the user wrote their message in a language OTHER THAN "${languageName}":
  1. Translate the user's message into "${languageName}". Provide this translation in the "userTargetLanguageText" field.
  2. Set "userTranslation" to the original text they typed ("${userInput}").
- If the user wrote their message IN "${languageName}":
  1. Provide the translation of their message into their inferred native/preferred language in the "userTranslation" field.
  2. Set "userTargetLanguageText" to an empty string ("").

Respond to the user's message in character as the AI coach Vexora. Keep your response brief, friendly, and appropriate for a language learner (simple vocabulary, 1-2 short sentences). 
CRITICAL: You must be highly conversational and proactive! Always drive the conversation forward by ending your response with a relevant follow-up question or a prompt that encourages the user to reply and stay engaged in the "${scenarioTitle}" scenario.

You MUST return a JSON object with this exact structure:
{
  "aiText": "Your response strictly in ${languageName}",
  "translation": "Translation of your response in the user's inferred native/preferred language",
  "userTranslation": "Translation of the user's message in their inferred native/preferred language (or original text if they typed in it)",
  "userTargetLanguageText": "Target language translation of user's message if they didn't type in ${languageName}, otherwise empty string",
  "suggestions": [
    {
      "text": "Helpful quick reply suggestion 1 for the user strictly in ${languageName}",
      "translation": "Translation of suggestion 1 in the user's inferred native/preferred language"
    },
    {
      "text": "Helpful quick reply suggestion 2 for the user strictly in ${languageName}",
      "translation": "Translation of suggestion 2 in the user's inferred native/preferred language"
    }
  ]
}

Verify that "aiText", "userTargetLanguageText" (if not empty), and the "suggestions" text fields are strictly written in "${languageName}". The "translation" fields MUST be in the user's inferred native language (e.g. French, Spanish, English, etc).`;

  // Call OpenRouter API directly
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
      "HTTP-Referer": "https://duolingoclone.com", 
      "X-Title": "Duolingo Clone"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini", // Fast/cheap model on OpenRouter
      messages: [
        {
          role: "system",
          content: "You only reply in valid raw JSON format as requested.",
        },
        {
          role: "user",
          content: systemPrompt,
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

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid AI response: Expected a JSON object");
  }

  if (typeof parsed.aiText !== "string" || typeof parsed.translation !== "string") {
    throw new Error("Invalid AI response: Missing required aiText or translation fields");
  }

  if (!Array.isArray(parsed.suggestions)) {
    throw new Error("Invalid AI response: suggestions must be an array");
  }

  return parsed as AIResponse;
}
