import { Lesson } from "../types/learning";

export const lessonsList: Lesson[] = [
  // ==========================================
  // --- SPANISH LESSONS (Unit 1) ---
  // ==========================================
  {
    id: "es-u1-l1",
    unitId: "es-unit-1",
    title: "👋 Basic Greetings",
    description: "Learn how to say hello, goodbye, and ask how someone is doing.",
    order: 1,
    xp: 10,
    goals: ["👋 Greet someone in Spanish", "👋 Say goodbye", "❓ Ask simple 'how are you' questions"],
    vocabularyIds: ["es-vocab-hola", "es-vocab-adios", "es-vocab-gracias"],
    phraseIds: ["es-phrase-how-are-you", "es-phrase-good-morning", "es-phrase-nice-to-meet-you"],
    activities: [
      {
        id: "es-u1-l1-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the correct translation of 'hello' 👋",
        question: "hello",
        correctAnswer: "hola",
        xpReward: 2,
        options: ["hola", "adiós", "gracias", "hombre"]
      },
      {
        id: "es-u1-l1-act2",
        type: "MATCH_PAIRS",
        prompt: "Match the vocabulary pairs 🧩",
        question: "Vocabulary match",
        correctAnswer: "Matches completed",
        xpReward: 3,
        pairs: [
          { left: "hola", right: "hello" },
          { left: "adiós", right: "goodbye" },
          { left: "gracias", right: "thank you" }
        ]
      },
      {
        id: "es-u1-l1-act3",
        type: "TRANSLATE_SENTENCE",
        prompt: "Translate this sentence to English 📝",
        question: "¡Hola! ¿Cómo estás?",
        correctAnswer: "Hello! How are you?",
        xpReward: 2,
        wordBank: ["Hello!", "How", "are", "you", "boy", "apple", "bread", "water"]
      },
      {
        id: "es-u1-l1-act4",
        type: "FILL_BLANK",
        prompt: "Fill in the blank to say 'Good morning' ☀️",
        question: "Good morning",
        correctAnswer: "días",
        xpReward: 1,
        sentenceWithBlank: "Buenos _____.",
        options: ["días", "noches", "tardes"]
      },
      {
        id: "es-u1-l1-act5",
        type: "SPEAK_PHRASE",
        prompt: "Speak the phrase aloud 🗣️",
        question: "Mucho gusto",
        correctAnswer: "Mucho gusto",
        xpReward: 2,
        phoneticTip: "moo-cho goos-toh"
      }
    ]
  },
  {
    id: "es-u1-l2",
    unitId: "es-unit-1",
    title: "👦 Everyday Nouns",
    description: "Master basic gendered nouns like boy, girl, man, and woman.",
    order: 2,
    xp: 15,
    goals: ["⚖️ Distinguish between masculine and feminine nouns", "👦👧 Identify key nouns like boy and girl"],
    vocabularyIds: ["es-vocab-nino", "es-vocab-nina", "es-vocab-hombre", "es-vocab-mujer"],
    phraseIds: ["es-phrase-my-name-is"],
    activities: [
      {
        id: "es-u1-l2-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'the boy' 👦",
        question: "the boy",
        correctAnswer: "el niño",
        xpReward: 2,
        options: ["el niño", "la niña", "el hombre", "la mujer"]
      },
      {
        id: "es-u1-l2-act2",
        type: "FILL_BLANK",
        prompt: "Complete the sentence to mean 'The girl' 👧",
        question: "The girl",
        correctAnswer: "La niña",
        xpReward: 2,
        sentenceWithBlank: "_____ lee un libro.",
        options: ["La niña", "El niño", "El hombre"]
      },
      {
        id: "es-u1-l2-act3",
        type: "TRANSLATE_SENTENCE",
        prompt: "Translate this sentence to English 📝",
        question: "El hombre lee un libro.",
        correctAnswer: "The man reads a book.",
        xpReward: 3,
        wordBank: ["The", "man", "reads", "a", "book.", "boy", "girl", "apple"]
      },
      {
        id: "es-u1-l2-act4",
        type: "MATCH_PAIRS",
        prompt: "Match the words with their translations 🧩",
        question: "Words match",
        correctAnswer: "Matches completed",
        xpReward: 3,
        pairs: [
          { left: "hombre", right: "man" },
          { left: "mujer", right: "woman" },
          { left: "niño", right: "boy" },
          { left: "niña", right: "girl" }
        ]
      },
      {
        id: "es-u1-l2-act5",
        type: "SPEAK_PHRASE",
        prompt: "Introduce yourself in Spanish 👤",
        question: "Me llamo Juan",
        correctAnswer: "Me llamo Juan",
        xpReward: 5,
        phoneticTip: "meh yah-moh hwan"
      }
    ]
  },
  {
    id: "es-u1-l3",
    unitId: "es-unit-1",
    title: "🍎 Food & Drinks",
    description: "Learn basic items like bread, water, milk, and apple.",
    order: 3,
    xp: 15,
    goals: ["🍽️ Order simple food items", "🍎🍞 Use vocabulary for bread, water, and apple"],
    vocabularyIds: ["es-vocab-manzana", "es-vocab-pan", "es-vocab-agua", "es-vocab-leche"],
    phraseIds: ["es-phrase-i-am-from"],
    activities: [
      {
        id: "es-u1-l3-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'apple' 🍎",
        question: "apple",
        correctAnswer: "manzana",
        xpReward: 2,
        options: ["manzana", "pan", "leche", "agua"]
      },
      {
        id: "es-u1-l3-act2",
        type: "FILL_BLANK",
        prompt: "Fill in the blank: 'The cat drinks milk' 🐱🥛",
        question: "The cat drinks milk",
        correctAnswer: "leche",
        xpReward: 3,
        sentenceWithBlank: "El gato bebe _____.",
        options: ["leche", "pan", "manzana"]
      },
      {
        id: "es-u1-l3-act3",
        type: "TRANSLATE_SENTENCE",
        prompt: "Translate this sentence to English 📝",
        question: "La manzana es roja.",
        correctAnswer: "The apple is red.",
        xpReward: 3,
        wordBank: ["The", "apple", "is", "red.", "bread", "water", "cat", "dog"]
      },
      {
        id: "es-u1-l3-act4",
        type: "MATCH_PAIRS",
        prompt: "Match the food words 🧩",
        question: "Food match",
        correctAnswer: "Matches completed",
        xpReward: 3,
        pairs: [
          { left: "pan", right: "bread" },
          { left: "agua", right: "water" },
          { left: "leche", right: "milk" },
          { left: "manzana", right: "apple" }
        ]
      },
      {
        id: "es-u1-l3-act5",
        type: "SPEAK_PHRASE",
        prompt: "Practice saying where you are from 🗺️",
        question: "Yo soy de España",
        correctAnswer: "Yo soy de España",
        xpReward: 4,
        phoneticTip: "yoh soy deh ehs-pah-nyah"
      }
    ]
  },

  // ==========================================
  // --- FRENCH LESSONS (Unit 1) ---
  // ==========================================
  {
    id: "fr-u1-l1",
    unitId: "fr-unit-1",
    title: "🥖 French Salutations",
    description: "Learn basic French greetings and expressions of polite interaction.",
    order: 1,
    xp: 10,
    goals: ["👋 Say hello and goodbye in French", "❓ Ask how someone is doing", "🙏 Politely say thank you"],
    vocabularyIds: ["fr-vocab-bonjour", "fr-vocab-salut", "fr-vocab-merci"],
    phraseIds: ["fr-phrase-how-are-you", "fr-phrase-good-morning", "fr-phrase-nice-to-meet-you"],
    activities: [
      {
        id: "fr-u1-l1-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'hello' 👋",
        question: "hello",
        correctAnswer: "bonjour",
        xpReward: 2,
        options: ["bonjour", "merci", "garçon", "fille"]
      },
      {
        id: "fr-u1-l1-act2",
        type: "MATCH_PAIRS",
        prompt: "Match the greetings 🧩",
        question: "Greetings match",
        correctAnswer: "Matches completed",
        xpReward: 3,
        pairs: [
          { left: "bonjour", right: "hello" },
          { left: "salut", right: "hi / bye" },
          { left: "merci", right: "thank you" }
        ]
      },
      {
        id: "fr-u1-l1-act3",
        type: "TRANSLATE_SENTENCE",
        prompt: "Translate to English 📝",
        question: "Comment ça va ?",
        correctAnswer: "How is it going?",
        xpReward: 3,
        wordBank: ["How", "is", "it", "going?", "hello", "girl", "apple", "bread"]
      },
      {
        id: "fr-u1-l1-act4",
        type: "FILL_BLANK",
        prompt: "Complete with the correct word for introduction 📝",
        question: "My name is Pierre",
        correctAnswer: "m'appelle",
        xpReward: 2,
        sentenceWithBlank: "Je _____ Pierre.",
        options: ["m'appelle", "suis", "merci"]
      }
    ]
  },

  // ==========================================
  // --- JAPANESE LESSONS (Unit 1) ---
  // ==========================================
  {
    id: "ja-u1-l1",
    unitId: "ja-unit-1",
    title: "⛩️ First Steps in Japanese",
    description: "Start speaking Japanese. Learn greetings and basic everyday interactions.",
    order: 1,
    xp: 10,
    goals: ["🙇 Greet people politely", "🙏 Express gratitude", "👋 Say goodbye"],
    vocabularyIds: ["ja-vocab-konnichiwa", "ja-vocab-sayounara", "ja-vocab-arigatou"],
    phraseIds: ["ja-phrase-how-are-you", "ja-phrase-nice-to-meet-you"],
    activities: [
      {
        id: "ja-u1-l1-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'hello' 👋",
        question: "hello",
        correctAnswer: "こんにちは",
        xpReward: 2,
        options: ["こんにちは", "さようなら", "ありがとう", "ねこ"]
      },
      {
        id: "ja-u1-l1-act2",
        type: "MATCH_PAIRS",
        prompt: "Match Japanese cards with English 🧩",
        question: "Japanese match",
        correctAnswer: "Matches completed",
        xpReward: 3,
        pairs: [
          { left: "こんにちは", right: "hello" },
          { left: "さようなら", right: "goodbye" },
          { left: "ありがとう", right: "thank you" }
        ]
      },
      {
        id: "ja-u1-l1-act3",
        type: "TRANSLATE_SENTENCE",
        prompt: "Translate this sentence to English 📝",
        question: "お元気ですか？",
        correctAnswer: "How are you?",
        xpReward: 3,
        wordBank: ["How", "are", "you?", "hello", "thank", "dog", "cat", "apple"]
      },
      {
        id: "ja-u1-l1-act4",
        type: "FILL_BLANK",
        prompt: "Complete the introduction: 'Nice to meet you' 🤝",
        question: "Nice to meet you",
        correctAnswer: "はじめまして",
        xpReward: 2,
        sentenceWithBlank: "_____、私の名前はケンです。",
        options: ["はじめまして", "こんにちは", "ありがとう"]
      }
    ]
  }
];

export const getLessonsByUnit = (unitId: string) => {
  return lessonsList
    .filter((l) => l.unitId === unitId)
    .sort((a, b) => a.order - b.order);
};

export const getLessonById = (id: string) => {
  return lessonsList.find((l) => l.id === id);
};
