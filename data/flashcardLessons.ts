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
  // ==========================================
  // --- SPANISH FLASHCARD LESSONS ---
  // ==========================================
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
  {
    id: "es-flash-3",
    title: "🔢 Numbers & Quantities",
    language: "es",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "Uno",
        translation: "One",
        pronunciation: "oo-noh",
        example: "Quiero uno, por favor.",
        exampleTranslation: "I want one, please.",
        pronunciationPrompt: "Say the number 'Uno'."
      },
      {
        type: "vocabulary",
        text: "Diez",
        translation: "Ten",
        pronunciation: "dee-ehs",
        example: "Hay diez personas aquí.",
        exampleTranslation: "There are ten people here.",
        pronunciationPrompt: "Pronounce 'Diez'."
      },
      {
        type: "phrase",
        text: "¿Cuánto cuesta?",
        translation: "How much does it cost?",
        pronunciation: "kwahn-toh kwes-tah",
        example: "¿Cuánto cuesta esta camisa?",
        exampleTranslation: "How much does this shirt cost?",
        pronunciationPrompt: "Ask the price: '¿Cuánto cuesta?'."
      },
      {
        type: "pronunciation",
        text: "Cien",
        translation: "One hundred",
        pronunciation: "see-ehn",
        example: "Tengo cien dólares.",
        exampleTranslation: "I have one hundred dollars.",
        pronunciationPrompt: "Say the number 'Cien'."
      }
    ]
  },
  {
    id: "es-flash-4",
    title: "✈️ Travel Essentials",
    language: "es",
    difficulty: "Intermediate",
    xpReward: 20,
    cards: [
      {
        type: "vocabulary",
        text: "Aeropuerto",
        translation: "Airport",
        pronunciation: "ah-eh-roh-pwehr-toh",
        example: "Vamos al aeropuerto temprano.",
        exampleTranslation: "We are going to the airport early.",
        pronunciationPrompt: "Say 'Aeropuerto'."
      },
      {
        type: "phrase",
        text: "¿Dónde está el hotel?",
        translation: "Where is the hotel?",
        pronunciation: "dohn-deh ehs-tah ehl oh-tehl",
        example: "Disculpe, ¿dónde está el hotel Plaza?",
        exampleTranslation: "Excuse me, where is the Plaza Hotel?",
        pronunciationPrompt: "Ask for directions: '¿Dónde está el hotel?'."
      },
      {
        type: "vocabulary",
        text: "Billete",
        translation: "Ticket",
        pronunciation: "bee-yeh-teh",
        example: "Necesito un billete de tren.",
        exampleTranslation: "I need a train ticket.",
        pronunciationPrompt: "Pronounce 'Billete'."
      },
      {
        type: "listening",
        text: "La estación",
        translation: "The station",
        pronunciation: "lah ehs-tah-see-ohn",
        example: "La estación está muy cerca.",
        exampleTranslation: "The station is very close.",
        pronunciationPrompt: "Say 'La estación'."
      }
    ]
  },
  {
    id: "es-flash-5",
    title: "👨‍👩‍👧‍👦 Family Members",
    language: "es",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "Madre",
        translation: "Mother",
        pronunciation: "mah-dreh",
        example: "Mi madre cocina muy bien.",
        exampleTranslation: "My mother cooks very well.",
        pronunciationPrompt: "Say 'Madre'."
      },
      {
        type: "vocabulary",
        text: "Padre",
        translation: "Father",
        pronunciation: "pah-dreh",
        example: "Mi padre trabaja en una oficina.",
        exampleTranslation: "My father works in an office.",
        pronunciationPrompt: "Pronounce 'Padre'."
      },
      {
        type: "phrase",
        text: "Tengo dos hermanos",
        translation: "I have two siblings",
        pronunciation: "tehn-goh dohs ehr-mah-nohs",
        example: "Tengo dos hermanos mayores.",
        exampleTranslation: "I have two older siblings.",
        pronunciationPrompt: "Say 'Tengo dos hermanos'."
      },
      {
        type: "listening",
        text: "Abuela",
        translation: "Grandmother",
        pronunciation: "ah-bweh-lah",
        example: "Mi abuela cuenta historias bonitas.",
        exampleTranslation: "My grandmother tells beautiful stories.",
        pronunciationPrompt: "Say 'Abuela'."
      }
    ]
  },

  // ==========================================
  // --- FRENCH FLASHCARD LESSONS ---
  // ==========================================
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
        translation: "Good Morning",
        pronunciation: "bohn-jhoor",
        example: "Bonjour ! Comment ça va ?",
        exampleTranslation: "Good morning! How are you?",
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
  {
    id: "fr-flash-2",
    title: "🍽️ Food & Dining",
    language: "fr",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "Fromage",
        translation: "Cheese",
        pronunciation: "froh-mahj",
        example: "Le fromage français est délicieux.",
        exampleTranslation: "French cheese is delicious.",
        pronunciationPrompt: "Pronounce 'Fromage'."
      },
      {
        type: "vocabulary",
        text: "Croissant",
        translation: "Croissant",
        pronunciation: "kwah-sahn",
        example: "Je prends un croissant au beurre.",
        exampleTranslation: "I have a butter croissant.",
        pronunciationPrompt: "Say 'Croissant' with French pronunciation."
      },
      {
        type: "phrase",
        text: "L'addition, s'il vous plaît",
        translation: "The bill, please",
        pronunciation: "lah-dee-see-ohn seel voo pleh",
        example: "Garçon, l'addition, s'il vous plaît.",
        exampleTranslation: "Waiter, the bill, please.",
        pronunciationPrompt: "Ask for the bill: 'L'addition, s'il vous plaît'."
      },
      {
        type: "listening",
        text: "Eau",
        translation: "Water",
        pronunciation: "oh",
        example: "Une bouteille d'eau, s'il vous plaît.",
        exampleTranslation: "A bottle of water, please.",
        pronunciationPrompt: "Say 'Eau'."
      }
    ]
  },
  {
    id: "fr-flash-3",
    title: "🔢 Numbers & Age",
    language: "fr",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "Un",
        translation: "One",
        pronunciation: "uhn",
        example: "J'ai un frère.",
        exampleTranslation: "I have one brother.",
        pronunciationPrompt: "Say the number 'Un'."
      },
      {
        type: "vocabulary",
        text: "Vingt",
        translation: "Twenty",
        pronunciation: "vahn",
        example: "J'ai vingt ans.",
        exampleTranslation: "I am twenty years old.",
        pronunciationPrompt: "Pronounce 'Vingt'."
      },
      {
        type: "phrase",
        text: "Quel âge as-tu ?",
        translation: "How old are you?",
        pronunciation: "kell ahj ah-too",
        example: "Quel âge as-tu ? J'ai dix-huit ans.",
        exampleTranslation: "How old are you? I am eighteen.",
        pronunciationPrompt: "Ask someone's age: 'Quel âge as-tu ?'."
      },
      {
        type: "pronunciation",
        text: "Cinquante",
        translation: "Fifty",
        pronunciation: "sahn-kahnt",
        example: "Il y a cinquante étudiants.",
        exampleTranslation: "There are fifty students.",
        pronunciationPrompt: "Say the number 'Cinquante'."
      }
    ]
  },
  {
    id: "fr-flash-4",
    title: "🎨 Colors & Descriptions",
    language: "fr",
    difficulty: "Intermediate",
    xpReward: 20,
    cards: [
      {
        type: "vocabulary",
        text: "Rouge",
        translation: "Red",
        pronunciation: "roojh",
        example: "La voiture rouge est rapide.",
        exampleTranslation: "The red car is fast.",
        pronunciationPrompt: "Say the color 'Rouge'."
      },
      {
        type: "vocabulary",
        text: "Bleu",
        translation: "Blue",
        pronunciation: "bluh",
        example: "Le ciel est bleu aujourd'hui.",
        exampleTranslation: "The sky is blue today.",
        pronunciationPrompt: "Pronounce 'Bleu'."
      },
      {
        type: "phrase",
        text: "C'est très joli",
        translation: "It's very pretty",
        pronunciation: "seh treh joh-lee",
        example: "Regarde cette fleur, c'est très joli !",
        exampleTranslation: "Look at this flower, it's very pretty!",
        pronunciationPrompt: "Say 'C'est très joli'."
      },
      {
        type: "listening",
        text: "Noir",
        translation: "Black",
        pronunciation: "nwahr",
        example: "Mon chat est noir et blanc.",
        exampleTranslation: "My cat is black and white.",
        pronunciationPrompt: "Say the color 'Noir'."
      }
    ]
  },
  {
    id: "fr-flash-5",
    title: "🕐 Daily Life",
    language: "fr",
    difficulty: "Intermediate",
    xpReward: 20,
    cards: [
      {
        type: "vocabulary",
        text: "Matin",
        translation: "Morning",
        pronunciation: "mah-tahn",
        example: "Je me lève tôt le matin.",
        exampleTranslation: "I wake up early in the morning.",
        pronunciationPrompt: "Say 'Matin'."
      },
      {
        type: "phrase",
        text: "Quelle heure est-il ?",
        translation: "What time is it?",
        pronunciation: "kell uhr eh-teel",
        example: "Excusez-moi, quelle heure est-il ?",
        exampleTranslation: "Excuse me, what time is it?",
        pronunciationPrompt: "Ask the time: 'Quelle heure est-il ?'."
      },
      {
        type: "vocabulary",
        text: "Travailler",
        translation: "To work",
        pronunciation: "trah-vah-yay",
        example: "Je travaille de neuf heures à cinq heures.",
        exampleTranslation: "I work from nine to five.",
        pronunciationPrompt: "Say the verb 'Travailler'."
      },
      {
        type: "listening",
        text: "Bonne nuit",
        translation: "Good night",
        pronunciation: "bohn nwee",
        example: "Bonne nuit, fais de beaux rêves !",
        exampleTranslation: "Good night, sweet dreams!",
        pronunciationPrompt: "Say 'Bonne nuit'."
      }
    ]
  },

  // ==========================================
  // --- JAPANESE FLASHCARD LESSONS ---
  // ==========================================
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
  },
  {
    id: "ja-flash-2",
    title: "🍣 Food & Ordering",
    language: "ja",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "すし",
        translation: "Sushi",
        pronunciation: "su-shi",
        example: "すしが大好きです。",
        exampleTranslation: "I love sushi.",
        pronunciationPrompt: "Say 'Sushi'."
      },
      {
        type: "vocabulary",
        text: "みず",
        translation: "Water",
        pronunciation: "mee-zu",
        example: "お水をください。",
        exampleTranslation: "Water, please.",
        pronunciationPrompt: "Pronounce 'Mizu'."
      },
      {
        type: "phrase",
        text: "いただきます",
        translation: "Let's eat (said before meals)",
        pronunciation: "ee-tah-dah-kee-mah-su",
        example: "ご飯の前に「いただきます」と言います。",
        exampleTranslation: "Before a meal, you say 'Itadakimasu'.",
        pronunciationPrompt: "Say 'Itadakimasu' before eating."
      },
      {
        type: "listening",
        text: "おちゃ",
        translation: "Tea",
        pronunciation: "oh-chah",
        example: "おちゃを一杯いかがですか？",
        exampleTranslation: "Would you like a cup of tea?",
        pronunciationPrompt: "Say 'Ocha'."
      }
    ]
  },
  {
    id: "ja-flash-3",
    title: "🔢 Numbers & Counting",
    language: "ja",
    difficulty: "Beginner",
    xpReward: 15,
    cards: [
      {
        type: "vocabulary",
        text: "いち",
        translation: "One",
        pronunciation: "ee-chee",
        example: "いちばん好きな食べ物は何ですか？",
        exampleTranslation: "What is your number one favorite food?",
        pronunciationPrompt: "Say the number 'Ichi'."
      },
      {
        type: "vocabulary",
        text: "じゅう",
        translation: "Ten",
        pronunciation: "joo",
        example: "じゅう円をください。",
        exampleTranslation: "Please give me ten yen.",
        pronunciationPrompt: "Pronounce 'Juu'."
      },
      {
        type: "phrase",
        text: "いくらですか？",
        translation: "How much is it?",
        pronunciation: "ee-ku-rah deh-su-kah",
        example: "すみません、これはいくらですか？",
        exampleTranslation: "Excuse me, how much is this?",
        pronunciationPrompt: "Ask the price: 'Ikura desu ka?'."
      },
      {
        type: "pronunciation",
        text: "ひゃく",
        translation: "One hundred",
        pronunciation: "hyah-ku",
        example: "ひゃく円のお菓子を買いました。",
        exampleTranslation: "I bought a 100 yen snack.",
        pronunciationPrompt: "Say the number 'Hyaku'."
      }
    ]
  },
  {
    id: "ja-flash-4",
    title: "🌸 Colors & Nature",
    language: "ja",
    difficulty: "Intermediate",
    xpReward: 20,
    cards: [
      {
        type: "vocabulary",
        text: "あか",
        translation: "Red",
        pronunciation: "ah-kah",
        example: "あかい花がきれいです。",
        exampleTranslation: "The red flower is beautiful.",
        pronunciationPrompt: "Say the color 'Aka'."
      },
      {
        type: "vocabulary",
        text: "あお",
        translation: "Blue",
        pronunciation: "ah-oh",
        example: "空はあおいです。",
        exampleTranslation: "The sky is blue.",
        pronunciationPrompt: "Pronounce 'Ao'."
      },
      {
        type: "phrase",
        text: "きれいですね",
        translation: "It's beautiful, isn't it?",
        pronunciation: "kee-reh-ee deh-su-neh",
        example: "この花はきれいですね。",
        exampleTranslation: "This flower is beautiful, isn't it?",
        pronunciationPrompt: "Compliment something: 'Kirei desu ne'."
      },
      {
        type: "listening",
        text: "みどり",
        translation: "Green",
        pronunciation: "mee-doh-ree",
        example: "みどりの山が見えます。",
        exampleTranslation: "I can see green mountains.",
        pronunciationPrompt: "Say the color 'Midori'."
      }
    ]
  },
  {
    id: "ja-flash-5",
    title: "🕐 Daily Activities",
    language: "ja",
    difficulty: "Intermediate",
    xpReward: 20,
    cards: [
      {
        type: "vocabulary",
        text: "おきます",
        translation: "To wake up",
        pronunciation: "oh-kee-mah-su",
        example: "毎朝、六時におきます。",
        exampleTranslation: "I wake up at six every morning.",
        pronunciationPrompt: "Say the verb 'Okimasu'."
      },
      {
        type: "phrase",
        text: "学校にいきます",
        translation: "I go to school",
        pronunciation: "gah-kou nee ee-kee-mah-su",
        example: "毎日、学校にいきます。",
        exampleTranslation: "I go to school every day.",
        pronunciationPrompt: "Say 'Gakkou ni ikimasu'."
      },
      {
        type: "vocabulary",
        text: "たべます",
        translation: "To eat",
        pronunciation: "tah-beh-mah-su",
        example: "昼ごはんを食堂でたべます。",
        exampleTranslation: "I eat lunch at the cafeteria.",
        pronunciationPrompt: "Say the verb 'Tabemasu'."
      },
      {
        type: "listening",
        text: "ねます",
        translation: "To sleep",
        pronunciation: "neh-mah-su",
        example: "十時にねます。おやすみなさい。",
        exampleTranslation: "I go to sleep at ten. Good night.",
        pronunciationPrompt: "Say the verb 'Nemasu'."
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
