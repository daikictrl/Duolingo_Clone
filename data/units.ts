import { Unit } from "../types/learning";

export const unitsList: Unit[] = [
  // --- SPANISH UNITS ---
  {
    id: "es-unit-1",
    languageId: "es",
    title: "👋 Unit 1: Basic Greetings & Everyday Nouns",
    description: "Start your Spanish journey! Learn how to say hello, introduce yourself, and master basic nouns like boy, girl, apple, and bread. 🍎🥖",
    lessonIds: ["es-u1-l1", "es-u1-l2", "es-u1-l3", "es-u1-l4"],
    order: 1
  },
  {
    id: "es-unit-2",
    languageId: "es",
    title: "👨‍👩‍👧‍👦 Unit 2: Family & Common Expressions",
    description: "Extend your conversational skills! Talk about family members, express thanks, and use simple daily phrases.💬",
    lessonIds: ["es-u2-l1", "es-u2-l2", "es-u2-l3", "es-u2-l4"],
    order: 2
  },

  // --- FRENCH UNITS ---
  {
    id: "fr-unit-1",
    languageId: "fr",
    title: "🥖 Unit 1: French Salutations & Pronouns",
    description: "Take your first steps in French! Learn essential greetings, introduction phrases, and basic masculine and feminine nouns. ✨",
    lessonIds: ["fr-u1-l1", "fr-u1-l2", "fr-u1-l3"],
    order: 1
  },
  {
    id: "fr-unit-2",
    languageId: "fr",
    title: "🍷 Unit 2: Food & Socializing",
    description: "Discover culinary words and build simple compound sentences in French! 🍽️",
    lessonIds: ["fr-u2-l1", "fr-u2-l2", "fr-u2-l3"],
    order: 2
  },

  // --- JAPANESE UNITS ---
  {
    id: "ja-unit-1",
    languageId: "ja",
    title: "⛩️ Unit 1: The Basics of Japanese",
    description: "Step into Japanese! Learn how to greet others politely, say goodbye, express thanks, and identify common animals. 🐱🐶",
    lessonIds: ["ja-u1-l1", "ja-u1-l2", "ja-u1-l3"],
    order: 1
  },
  {
    id: "ja-unit-2",
    languageId: "ja",
    title: "🍱 Unit 2: Daily Needs & Common Words",
    description: "Learn to ask for water, express simple desires, and navigate basic conversation blocks. 💧",
    lessonIds: ["ja-u2-l1", "ja-u2-l2", "ja-u2-l3"],
    order: 2
  }
];

export const getUnitsByLanguage = (languageId: string) => {
  return unitsList
    .filter((u) => u.languageId === languageId)
    .sort((a, b) => a.order - b.order);
};

export const getUnitById = (id: string) => {
  return unitsList.find((u) => u.id === id);
};
