export interface QuizQuestion {
  id: string;
  type: "MULTIPLE_CHOICE" | "FILL_BLANK" | "MATCH_PAIRS";
  question: string;
  options?: string[];
  correctAnswer: string | string[]; // For matches: expected correct pairings or single correct answer
  explanation: string;
  sentenceWithBlank?: string; // For FILL_BLANK: e.g. "Yo _____ un manzana."
  pairs?: { left: string; right: string }[]; // For MATCH_PAIRS
}

export interface QuizSession {
  id: string;
  title: string;
  category: string;
  language: string; // "es" | "fr" | "ja"
  xpReward: number;
  questions: QuizQuestion[];
}

export const quizzes: QuizSession[] = [
  // --- SPANISH QUIZZES ---
  {
    id: "es-quiz-1",
    title: "👋 Conversational Basics",
    category: "Greetings",
    language: "es",
    xpReward: 15,
    questions: [
      {
        id: "es-q1-q1",
        type: "MULTIPLE_CHOICE",
        question: "How do you say 'Good morning' in Spanish? ☀️",
        options: ["Buenas noches", "Buenos días", "Hola", "Adiós"],
        correctAnswer: "Buenos días",
        explanation: "'Buenos días' is used for morning greetings, whereas 'Buenas noches' is for night/evening."
      },
      {
        id: "es-q1-q2",
        type: "FILL_BLANK",
        question: "Complete the sentence to mean 'Nice to meet you':",
        sentenceWithBlank: "Mucho _____.",
        options: ["gusto", "gracias", "hola"],
        correctAnswer: "gusto",
        explanation: "'Mucho gusto' literally means 'much pleasure' or 'nice to meet you'."
      },
      {
        id: "es-q1-q3",
        type: "MATCH_PAIRS",
        question: "Match the greetings with their meanings: 🧩",
        pairs: [
          { left: "hola", right: "hello" },
          { left: "gracias", right: "thank you" },
          { left: "adiós", right: "goodbye" }
        ],
        correctAnswer: ["hola:hello", "gracias:thank you", "adiós:goodbye"],
        explanation: "Matches: hola = hello, gracias = thank you, adiós = goodbye."
      }
    ]
  },
  {
    id: "es-quiz-2",
    title: "🍎 Kitchen Vocabulary",
    category: "Food & Drinks",
    language: "es",
    xpReward: 15,
    questions: [
      {
        id: "es-q2-q1",
        type: "MULTIPLE_CHOICE",
        question: "Which of the following means 'bread' in Spanish? 🥖",
        options: ["Agua", "Leche", "Pan", "Manzana"],
        correctAnswer: "Pan",
        explanation: "'Pan' is the Spanish word for bread. 'Agua' is water and 'Leche' is milk."
      },
      {
        id: "es-q2-q2",
        type: "FILL_BLANK",
        question: "Complete the phrase: 'A glass of water'",
        sentenceWithBlank: "Un vaso de _____.",
        options: ["agua", "leche", "manzana"],
        correctAnswer: "agua",
        explanation: "'Un vaso de agua' is 'a glass of water'. 'Agua' is feminine but takes 'el' or 'de agua' normally."
      },
      {
        id: "es-q2-q3",
        type: "MATCH_PAIRS",
        question: "Match the food words: 🧩",
        pairs: [
          { left: "manzana", right: "apple" },
          { left: "leche", right: "milk" },
          { left: "perro", right: "dog" }
        ],
        correctAnswer: ["manzana:apple", "leche:milk", "perro:dog"],
        explanation: "Matches: manzana = apple, leche = milk, perro = dog."
      }
    ]
  },

  // --- FRENCH QUIZZES ---
  {
    id: "fr-quiz-1",
    title: "🥖 Conversational Basics",
    category: "Greetings",
    language: "fr",
    xpReward: 15,
    questions: [
      {
        id: "fr-q1-q1",
        type: "MULTIPLE_CHOICE",
        question: "How do you say 'Thank you very much' in French? 🙏",
        options: ["Bonjour", "Merci beaucoup", "S'il vous plaît", "Enchanté"],
        correctAnswer: "Merci beaucoup",
        explanation: "'Merci beaucoup' means 'Thank you very much'. 'S'il vous plaît' means 'please'."
      },
      {
        id: "fr-q1-q2",
        type: "FILL_BLANK",
        question: "Complete the sentence to introduce yourself as Pierre:",
        sentenceWithBlank: "Je _____ Pierre.",
        options: ["m'appelle", "suis", "merci"],
        correctAnswer: "m'appelle",
        explanation: "'Je m'appelle Pierre' means 'My name is Pierre'."
      },
      {
        id: "fr-q1-q3",
        type: "MATCH_PAIRS",
        question: "Match the French greetings: 🧩",
        pairs: [
          { left: "bonjour", right: "hello" },
          { left: "enchanté", right: "nice to meet you" },
          { left: "salut", right: "hi / bye" }
        ],
        correctAnswer: ["bonjour:hello", "enchanté:nice to meet you", "salut:hi / bye"],
        explanation: "Matches: bonjour = hello, enchanté = nice to meet you, salut = hi / bye."
      }
    ]
  },

  // --- JAPANESE QUIZZES ---
  {
    id: "ja-quiz-1",
    title: "⛩️ Conversational Basics",
    category: "Greetings",
    language: "ja",
    xpReward: 15,
    questions: [
      {
        id: "ja-q1-q1",
        type: "MULTIPLE_CHOICE",
        question: "What is the polite translation of 'thank you' in Japanese? 🙇",
        options: ["こんにちは", "さようなら", "ありがとうございます", "はじめまして"],
        correctAnswer: "ありがとうございます",
        explanation: "'Arigatou gozaimasu' (ありがとうございます) is the polite way of saying 'thank you'."
      },
      {
        id: "ja-q1-q2",
        type: "FILL_BLANK",
        question: "Complete the phrase to say goodbye:",
        sentenceWithBlank: "皆さん、_____。",
        options: ["さようなら", "こんにちは", "ありがとう"],
        correctAnswer: "さようなら",
        explanation: "'Sayounara' (さようなら) means 'Goodbye'. Thus, 'Goodbye, everyone'."
      },
      {
        id: "ja-q1-q3",
        type: "MATCH_PAIRS",
        question: "Match the Japanese expressions: 🧩",
        pairs: [
          { left: "こんにちは", right: "hello" },
          { left: "いぬ", right: "dog" },
          { left: "ねこ", right: "cat" }
        ],
        correctAnswer: ["こんにちは:hello", "いぬ:dog", "ねこ:cat"],
        explanation: "Matches: こんにちは = hello, いぬ = dog, ねこ = cat."
      }
    ]
  }
];

export const getQuizzesByLanguage = (langId: string) => {
  return quizzes.filter((q) => q.language === langId);
};

export const getQuizById = (id: string) => {
  return quizzes.find((q) => q.id === id);
};
