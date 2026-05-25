import { Lesson } from "../types/learning";

const lessonsListBase: Lesson[] = [
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

export const additionalLessonsList: Lesson[] = [
  // --- SPANISH EXTENSION ---
  // Unit 1
  {
    id: "es-u1-l4",
    unitId: "es-unit-1",
    title: "💬 Social Greetings",
    description: "Learn how to introduce yourself and express thanks in Spanish.",
    order: 4,
    xp: 15,
    goals: ["💬 Introduce yourself", "🙏 Say thank you and you're welcome"],
    vocabularyIds: ["es-vocab-gracias", "es-vocab-de-nada"],
    phraseIds: ["es-phrase-my-name-is"],
    activities: [
      {
        id: "es-u1-l4-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'you're welcome' 🙏",
        question: "you're welcome",
        correctAnswer: "de nada",
        xpReward: 2,
        options: ["de nada", "gracias", "por favor", "hola"]
      }
    ]
  },
  // Unit 2
  {
    id: "es-u2-l1",
    unitId: "es-unit-2",
    title: "👨‍👩‍👧‍👦 Family Members",
    description: "Learn nouns for family members: mother, father, brother, and sister.",
    order: 1,
    xp: 15,
    goals: ["👨‍👩‍👧‍👦 Name core family members in Spanish"],
    vocabularyIds: ["es-vocab-madre", "es-vocab-padre", "es-vocab-hermano", "es-vocab-hermana"],
    phraseIds: [],
    activities: [
      {
        id: "es-u2-l1-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'mother' 👩",
        question: "mother",
        correctAnswer: "madre",
        xpReward: 2,
        options: ["madre", "padre", "hermano", "hijo"]
      }
    ]
  },
  {
    id: "es-u2-l2",
    unitId: "es-unit-2",
    title: "💬 Everyday Expressions",
    description: "Learn common expressions like please, excuse me, and yes/no.",
    order: 2,
    xp: 15,
    goals: ["💬 Say please and thank you", "💬 Say yes and no"],
    vocabularyIds: ["es-vocab-por-favor", "es-vocab-si", "es-vocab-no"],
    phraseIds: [],
    activities: [
      {
        id: "es-u2-l2-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'please' 🙏",
        question: "please",
        correctAnswer: "por favor",
        xpReward: 2,
        options: ["por favor", "gracias", "de nada", "hola"]
      }
    ]
  },
  {
    id: "es-u2-l3",
    unitId: "es-unit-2",
    title: "☀️ Talking About the Day",
    description: "Learn greetings for different times of day: morning, afternoon, night.",
    order: 3,
    xp: 15,
    goals: ["☀️ Greet someone depending on the time of day"],
    vocabularyIds: ["es-vocab-buenos-dias", "es-vocab-buenas-tardes", "es-vocab-buenas-noches"],
    phraseIds: [],
    activities: [
      {
        id: "es-u2-l3-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'Good afternoon' 🌇",
        question: "Good afternoon",
        correctAnswer: "buenas tardes",
        xpReward: 2,
        options: ["buenas tardes", "buenos días", "buenas noches", "hola"]
      }
    ]
  },
  {
    id: "es-u2-l4",
    unitId: "es-unit-2",
    title: "👥 Describing Family",
    description: "Use simple adjectives to describe your family members.",
    order: 4,
    xp: 15,
    goals: ["👥 Describe family member attributes"],
    vocabularyIds: ["es-vocab-grande", "es-vocab-pequeno"],
    phraseIds: [],
    activities: [
      {
        id: "es-u2-l4-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'big' 🏠",
        question: "big",
        correctAnswer: "grande",
        xpReward: 2,
        options: ["grande", "pequeño", "bonito", "feo"]
      }
    ]
  },

  // --- FRENCH EXTENSION ---
  // Unit 1
  {
    id: "fr-u1-l2",
    unitId: "fr-unit-1",
    title: "👥 Pronouns & Verbs",
    description: "Master basic pronouns like 'Je' and verbs like 'être'.",
    order: 2,
    xp: 15,
    goals: ["👥 Say 'I am' and use simple pronouns"],
    vocabularyIds: ["fr-vocab-je", "fr-vocab-suis"],
    phraseIds: [],
    activities: [
      {
        id: "fr-u1-l2-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'I am' 👥",
        question: "I am",
        correctAnswer: "Je suis",
        xpReward: 2,
        options: ["Je suis", "Tu es", "Il est", "Elle est"]
      }
    ]
  },
  {
    id: "fr-u1-l3",
    unitId: "fr-unit-1",
    title: "🏡 Common Nouns",
    description: "Learn simple words for house, book, cat, and dog.",
    order: 3,
    xp: 15,
    goals: ["🏡 Name pets and objects"],
    vocabularyIds: ["fr-vocab-chat", "fr-vocab-chien", "fr-vocab-livre", "fr-vocab-maison"],
    phraseIds: [],
    activities: [
      {
        id: "fr-u1-l3-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'the cat' 🐱",
        question: "the cat",
        correctAnswer: "le chat",
        xpReward: 2,
        options: ["le chat", "le chien", "la maison", "le livre"]
      }
    ]
  },
  // Unit 2
  {
    id: "fr-u2-l1",
    unitId: "fr-unit-2",
    title: "🍷 Food & Dining",
    description: "Learn how to order food and drink items like bread and wine.",
    order: 1,
    xp: 15,
    goals: ["🍽️ Order basic items at a restaurant"],
    vocabularyIds: ["fr-vocab-pain", "fr-vocab-vin", "fr-vocab-eau"],
    phraseIds: [],
    activities: [
      {
        id: "fr-u2-l1-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'bread' 🥖",
        question: "bread",
        correctAnswer: "pain",
        xpReward: 2,
        options: ["pain", "eau", "vin", "café"]
      }
    ]
  },
  {
    id: "fr-u2-l2",
    unitId: "fr-unit-2",
    title: "☕ Drinks & Paying",
    description: "Learn to order coffee, water, and ask for the bill.",
    order: 2,
    xp: 15,
    goals: ["☕ Order coffee and ask for the check"],
    vocabularyIds: ["fr-vocab-cafe", "fr-vocab-l-addition"],
    phraseIds: [],
    activities: [
      {
        id: "fr-u2-l2-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'coffee' ☕",
        question: "coffee",
        correctAnswer: "café",
        xpReward: 2,
        options: ["café", "l'addition", "pain", "eau"]
      }
    ]
  },
  {
    id: "fr-u2-l3",
    unitId: "fr-unit-2",
    title: "🗣️ Simple Recommendations",
    description: "Learn how to ask if something is good or recommend something.",
    order: 3,
    xp: 15,
    goals: ["🗣️ Ask if food/drinks are good"],
    vocabularyIds: ["fr-vocab-bon", "fr-vocab-tres-bon"],
    phraseIds: [],
    activities: [
      {
        id: "fr-u2-l3-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'very good' 👍",
        question: "very good",
        correctAnswer: "très bon",
        xpReward: 2,
        options: ["très bon", "bon", "mauvais", "merci"]
      }
    ]
  },

  // --- JAPANESE EXTENSION ---
  // Unit 1
  {
    id: "ja-u1-l2",
    unitId: "ja-unit-1",
    title: "🔢 Numbers & Counting",
    description: "Learn how to count from one to five in Japanese.",
    order: 2,
    xp: 15,
    goals: ["🔢 Count from one to five"],
    vocabularyIds: ["ja-vocab-ichi", "ja-vocab-ni", "ja-vocab-san", "ja-vocab-yon", "ja-vocab-go"],
    phraseIds: [],
    activities: [
      {
        id: "ja-u1-l2-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'three' 🔢",
        question: "three",
        correctAnswer: "さん",
        xpReward: 2,
        options: ["いち", "に", "さん", "よん"]
      }
    ]
  },
  {
    id: "ja-u1-l3",
    unitId: "ja-unit-1",
    title: "🐱 Common Animals",
    description: "Learn nouns for everyday objects and pets like cat and dog.",
    order: 3,
    xp: 15,
    goals: ["🐱 Name common animals like cat and dog"],
    vocabularyIds: ["ja-vocab-neko", "ja-vocab-inu"],
    phraseIds: [],
    activities: [
      {
        id: "ja-u1-l3-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'dog' 🐶",
        question: "dog",
        correctAnswer: "いぬ",
        xpReward: 2,
        options: ["ねこ", "いぬ", "とり", "さかな"]
      }
    ]
  },
  // Unit 2
  {
    id: "ja-u2-l1",
    unitId: "ja-unit-2",
    title: "🍣 Food & Eating",
    description: "Learn food nouns like sushi, water, and simple dining verbs.",
    order: 1,
    xp: 15,
    goals: ["🍣 Identify basic Japanese food and water"],
    vocabularyIds: ["ja-vocab-sushi", "ja-vocab-mizu"],
    phraseIds: [],
    activities: [
      {
        id: "ja-u2-l1-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'water' 💧",
        question: "water",
        correctAnswer: "みず",
        xpReward: 2,
        options: ["みず", "お茶", "ごはん", "すし"]
      }
    ]
  },
  {
    id: "ja-u2-l2",
    unitId: "ja-unit-2",
    title: "🗺️ Simple Directions",
    description: "Learn basic navigation vocabulary like where is it or station.",
    order: 2,
    xp: 15,
    goals: ["🗺️ Ask where a station is"],
    vocabularyIds: ["ja-vocab-eki", "ja-vocab-doko"],
    phraseIds: [],
    activities: [
      {
        id: "ja-u2-l2-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the translation of 'station' 🚉",
        question: "station",
        correctAnswer: "えき",
        xpReward: 2,
        options: ["えき", "みせ", "いえ", "こうえん"]
      }
    ]
  },
  {
    id: "ja-u2-l3",
    unitId: "ja-unit-2",
    title: "⏰ Time & Hours",
    description: "Learn how to ask or say simple hours of the day.",
    order: 3,
    xp: 15,
    goals: ["⏰ Say simple times in Japanese"],
    vocabularyIds: ["ja-vocab-ji"],
    phraseIds: [],
    activities: [
      {
        id: "ja-u2-l3-act1",
        type: "MULTIPLE_CHOICE",
        prompt: "Select the correct counter for hours/time ⏰",
        question: "o'clock",
        correctAnswer: "じ",
        xpReward: 2,
        options: ["じ", "ふん", "ねん", "がつ"]
      }
    ]
  }
];

export const lessonsList: Lesson[] = [
  ...lessonsListBase,
  ...additionalLessonsList
];

export const getLessonsByUnit = (unitId: string) => {
  return lessonsList
    .filter((l) => l.unitId === unitId)
    .sort((a, b) => a.order - b.order);
};

export const getLessonById = (id: string) => {
  return lessonsList.find((l) => l.id === id);
};
