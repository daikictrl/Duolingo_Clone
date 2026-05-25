export interface Flashcard {
  type: "vocabulary" | "phrase" | "listening" | "pronunciation";
  text: string;
  translation: string;
  pronunciation: string;
  example: string;
  exampleTranslation: string;
  audioPlaceholder?: string;
  pronunciationPrompt: string;
}

export interface FlashcardLesson {
  id: string;
  title: string;
  language: string; // "es" | "fr" | "ja"
  difficulty: "Beginner" | "Intermediate";
  xpReward: number;
  cards: Flashcard[];
}

export const flashcardLessons: FlashcardLesson[] = [
  // --- SPANISH FLASHCARD LESSONS ---
  {
    id: "es-flash-1",
    title: "👋 Greetings & Courtesy",
    language: "es",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "Hola",
        translation: "Hello",
        pronunciation: "oh-lah",
        example: "¡Hola! ¿Cómo estás?",
        exampleTranslation: "Hello! How are you?",
        pronunciationPrompt: "Say 'Hola' clearly."
      },
      {
        type: "pronunciation",
        text: "Buenos días",
        translation: "Good morning",
        pronunciation: "bweh-nohs dee-ahs",
        example: "Buenos días, mi amigo.",
        exampleTranslation: "Good morning, my friend.",
        pronunciationPrompt: "Speak the greeting 'Buenos días'."
      },
      {
        type: "phrase",
        text: "Muchas gracias",
        translation: "Thank you very much",
        pronunciation: "moo-chahs grah-syahs",
        example: "Muchas gracias por tu ayuda.",
        exampleTranslation: "Thank you very much for your help.",
        pronunciationPrompt: "Say thank you: 'Muchas gracias'."
      },
      {
        type: "listening",
        text: "Adiós",
        translation: "Goodbye",
        pronunciation: "ah-dyohs",
        example: "Adiós, nos vemos pronto.",
        exampleTranslation: "Goodbye, see you soon.",
        pronunciationPrompt: "Identify and speak 'Adiós'."
      }
    ]
  },
  {
    id: "es-flash-2",
    title: "🍎 Food & Drinks",
    language: "es",
    difficulty: "Beginner",
    xpReward: 20,
    cards: [
      {
        type: "vocabulary",
        text: "Manzana",
        translation: "Apple",
        pronunciation: "mahn-sah-nah",
        example: "Me gusta comer una manzana roja.",
        exampleTranslation: "I like to eat a red apple.",
        pronunciationPrompt: "Pronounce 'Manzana'."
      },
      {
        type: "vocabulary",
        text: "Pan",
        translation: "Bread",
        pronunciation: "pahn",
        example: "El pan está recién horneado.",
        exampleTranslation: "The bread is freshly baked.",
        pronunciationPrompt: "Say 'Pan'."
      },
      {
        type: "phrase",
        text: "Un vaso de agua",
        translation: "A glass of water",
        pronunciation: "oon bah-soh deh ah-gwah",
        example: "Por favor, dame un vaso de agua.",
        exampleTranslation: "Please, give me a glass of water.",
        pronunciationPrompt: "Request water: 'Un vaso de agua'."
      },
      {
        type: "listening",
        text: "Leche",
        translation: "Milk",
        pronunciation: "leh-cheh",
        example: "Yo bebo leche en el desayuno.",
        exampleTranslation: "I drink milk during breakfast.",
        pronunciationPrompt: "Say 'Leche'."
      }
    ]
  },

  // --- FRENCH FLASHCARD LESSONS ---
  {
    id: "fr-flash-1",
    title: "🥖 Basic Greetings",
    language: "fr",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "Bonjour",
        translation: "Hello / Good morning",
        pronunciation: "bohn-zhoor",
        example: "Bonjour ! Comment ça va ?",
        exampleTranslation: "Hello! How is it going?",
        pronunciationPrompt: "Say 'Bonjour' with a clear french tone."
      },
      {
        type: "phrase",
        text: "S'il vous plaît",
        translation: "Please (formal)",
        pronunciation: "seel voo pleh",
        example: "Un café, s'il vous plaît.",
        exampleTranslation: "A coffee, please.",
        pronunciationPrompt: "Say please: 'S'il vous plaît'."
      },
      {
        type: "pronunciation",
        text: "Enchanté",
        translation: "Nice to meet you",
        pronunciation: "ahn-shahn-tay",
        example: "Enchanté de vous rencontrer !",
        exampleTranslation: "Nice to meet you!",
        pronunciationPrompt: "Say 'Enchanté' to welcome someone."
      },
      {
        type: "listening",
        text: "Merci beaucoup",
        translation: "Thank you very much",
        pronunciation: "mair-see boh-koo",
        example: "Merci beaucoup pour les fleurs !",
        exampleTranslation: "Thank you very much for the flowers!",
        pronunciationPrompt: "Express gratitude: 'Merci beaucoup'."
      }
    ]
  },

  // --- JAPANESE FLASHCARD LESSONS ---
  {
    id: "ja-flash-1",
    title: "⛩️ Everyday Greetings",
    language: "ja",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "こんにちは",
        translation: "Hello",
        pronunciation: "kon-nee-chee-wah",
        example: "皆さん、こんにちは。",
        exampleTranslation: "Hello, everyone.",
        pronunciationPrompt: "Say 'Konnichiwa' politely."
      },
      {
        type: "phrase",
        text: "ありがとうございます",
        translation: "Thank you very much",
        pronunciation: "ah-ree-gah-toh go-zah-ee-mah-su",
        example: "手伝ってくれてありがとうございます。",
        exampleTranslation: "Thank you very much for helping me.",
        pronunciationPrompt: "Say thank you: 'Arigatou gozaimasu'."
      },
      {
        type: "pronunciation",
        text: "はじめまして",
        translation: "Nice to meet you",
        pronunciation: "hah-jee-meh-mash-teh",
        example: "はじめまして、ケンです。よろしく。",
        exampleTranslation: "Nice to meet you, I'm Ken. Pleased to meet you.",
        pronunciationPrompt: "Say 'Hajimemashite'."
      },
      {
        type: "listening",
        text: "さようなら",
        translation: "Goodbye",
        pronunciation: "sah-yoh-nah-rah",
        example: "皆さん、さようなら。",
        exampleTranslation: "Goodbye, everyone.",
        pronunciationPrompt: "Say farewell: 'Sayounara'."
      }
    ]
  }
];

export const getFlashcardLessonsByLanguage = (langId: string) => {
  return flashcardLessons.filter((l) => l.language === langId);
};

export const getFlashcardLessonById = (id: string) => {
  return flashcardLessons.find((l) => l.id === id);
};
