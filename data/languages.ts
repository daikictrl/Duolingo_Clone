import { Language } from "../types/learning";

export const languages: Language[] = [
  {
    id: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "https://flagcdn.com/w320/es.png",
    color: "#FF9500",
    description: "Learn the world's second most spoken language. Start with basic greetings, vocabulary, and pronouns."
  },
  {
    id: "fr",
    name: "French",
    nativeName: "Français",
    flag: "https://flagcdn.com/w320/fr.png",
    color: "#4D88FF",
    description: "Immerse yourself in the language of love. Master everyday greetings, nouns, and pronunciation."
  },
  {
    id: "ja",
    name: "Japanese",
    nativeName: "日本語",
    flag: "https://flagcdn.com/w320/jp.png",
    color: "#FF3B30",
    description: "Explore the rich culture of Japan. Begin with basic greetings, vocabulary, and polite expressions."
  }
];

export const getLanguageById = (id: string) => {
  return languages.find((lang) => lang.id === id);
};
