import { Phrase } from "../types/learning";

export const phraseList: Phrase[] = [
  // --- SPANISH ---
  {
    id: "es-phrase-how-are-you",
    languageId: "es",
    text: "¿Cómo estás?",
    translation: "How are you?",
    context: "Greetings"
  },
  {
    id: "es-phrase-good-morning",
    languageId: "es",
    text: "Buenos días",
    translation: "Good morning",
    context: "Greetings"
  },
  {
    id: "es-phrase-my-name-is",
    languageId: "es",
    text: "Me llamo Juan",
    translation: "My name is Juan",
    context: "Introduction"
  },
  {
    id: "es-phrase-nice-to-meet-you",
    languageId: "es",
    text: "Mucho gusto",
    translation: "Nice to meet you",
    context: "Greetings"
  },
  {
    id: "es-phrase-i-am-from",
    languageId: "es",
    text: "Yo soy de España",
    translation: "I am from Spain",
    context: "Introduction"
  },

  // --- FRENCH ---
  {
    id: "fr-phrase-how-are-you",
    languageId: "fr",
    text: "Comment ça va ?",
    translation: "How is it going?",
    context: "Greetings"
  },
  {
    id: "fr-phrase-good-morning",
    languageId: "fr",
    text: "Bonjour",
    translation: "Good morning / Hello",
    context: "Greetings"
  },
  {
    id: "fr-phrase-my-name-is",
    languageId: "fr",
    text: "Je m'appelle Pierre",
    translation: "My name is Pierre",
    context: "Introduction"
  },
  {
    id: "fr-phrase-nice-to-meet-you",
    languageId: "fr",
    text: "Enchanté",
    translation: "Nice to meet you",
    context: "Greetings"
  },
  {
    id: "fr-phrase-i-am-from",
    languageId: "fr",
    text: "Je suis de France",
    translation: "I am from France",
    context: "Introduction"
  },

  // --- JAPANESE ---
  {
    id: "ja-phrase-how-are-you",
    languageId: "ja",
    text: "お元気ですか？",
    translation: "How are you?",
    context: "Greetings"
  },
  {
    id: "ja-phrase-my-name-is",
    languageId: "ja",
    text: "私の名前はケンです。",
    translation: "My name is Ken.",
    context: "Introduction"
  },
  {
    id: "ja-phrase-nice-to-meet-you",
    languageId: "ja",
    text: "はじめまして。",
    translation: "Nice to meet you.",
    context: "Greetings"
  },
  {
    id: "ja-phrase-i-am-from",
    languageId: "ja",
    text: "日本から来ました。",
    translation: "I came from Japan.",
    context: "Introduction"
  }
];

export const getPhrasesByLanguage = (languageId: string) => {
  return phraseList.filter((p) => p.languageId === languageId);
};

export const getPhraseById = (id: string) => {
  return phraseList.find((p) => p.id === id);
};
