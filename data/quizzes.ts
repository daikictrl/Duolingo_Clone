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
  // ==========================================
  // --- SPANISH QUIZZES ---
  // ==========================================
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
  {
    id: "es-quiz-3",
    title: "🔢 Numbers & Counting",
    category: "Numbers",
    language: "es",
    xpReward: 20,
    questions: [
      {
        id: "es-q3-q1",
        type: "MULTIPLE_CHOICE",
        question: "What is the Spanish word for the number 'five'? 🖐️",
        options: ["Tres", "Cinco", "Siete", "Diez"],
        correctAnswer: "Cinco",
        explanation: "'Cinco' means five. 'Tres' is three, 'Siete' is seven, and 'Diez' is ten."
      },
      {
        id: "es-q3-q2",
        type: "FILL_BLANK",
        question: "Complete: 'I have three cats'",
        sentenceWithBlank: "Tengo _____ gatos.",
        options: ["tres", "cinco", "dos"],
        correctAnswer: "tres",
        explanation: "'Tres' means three. 'Tengo tres gatos' = 'I have three cats'."
      },
      {
        id: "es-q3-q3",
        type: "MATCH_PAIRS",
        question: "Match the numbers with their Spanish words: 🧩",
        pairs: [
          { left: "uno", right: "one" },
          { left: "cuatro", right: "four" },
          { left: "ocho", right: "eight" }
        ],
        correctAnswer: ["uno:one", "cuatro:four", "ocho:eight"],
        explanation: "Matches: uno = one, cuatro = four, ocho = eight."
      }
    ]
  },
  {
    id: "es-quiz-4",
    title: "✈️ Travel & Directions",
    category: "Travel",
    language: "es",
    xpReward: 20,
    questions: [
      {
        id: "es-q4-q1",
        type: "MULTIPLE_CHOICE",
        question: "How do you say 'Where is the hotel?' in Spanish? 🏨",
        options: ["¿Dónde está el hotel?", "¿Cuánto cuesta?", "¿Cómo te llamas?", "¿Qué hora es?"],
        correctAnswer: "¿Dónde está el hotel?",
        explanation: "'¿Dónde está el hotel?' literally means 'Where is the hotel?'. 'Dónde' = where, 'está' = is."
      },
      {
        id: "es-q4-q2",
        type: "FILL_BLANK",
        question: "Complete: 'Turn to the right'",
        sentenceWithBlank: "Gira a la _____.",
        options: ["derecha", "izquierda", "arriba"],
        correctAnswer: "derecha",
        explanation: "'Derecha' means right. 'Gira a la derecha' = 'Turn to the right'."
      },
      {
        id: "es-q4-q3",
        type: "MATCH_PAIRS",
        question: "Match the travel vocabulary: 🧩",
        pairs: [
          { left: "aeropuerto", right: "airport" },
          { left: "estación", right: "station" },
          { left: "calle", right: "street" }
        ],
        correctAnswer: ["aeropuerto:airport", "estación:station", "calle:street"],
        explanation: "Matches: aeropuerto = airport, estación = station, calle = street."
      }
    ]
  },
  {
    id: "es-quiz-5",
    title: "👨‍👩‍👧‍👦 Family & People",
    category: "Family",
    language: "es",
    xpReward: 20,
    questions: [
      {
        id: "es-q5-q1",
        type: "MULTIPLE_CHOICE",
        question: "What is the Spanish word for 'mother'? 👩",
        options: ["Hermana", "Madre", "Abuela", "Tía"],
        correctAnswer: "Madre",
        explanation: "'Madre' means mother. 'Hermana' is sister, 'Abuela' is grandmother, and 'Tía' is aunt."
      },
      {
        id: "es-q5-q2",
        type: "FILL_BLANK",
        question: "Complete: 'My brother is tall'",
        sentenceWithBlank: "Mi _____ es alto.",
        options: ["hermano", "hermana", "padre"],
        correctAnswer: "hermano",
        explanation: "'Hermano' means brother. 'Mi hermano es alto' = 'My brother is tall'."
      },
      {
        id: "es-q5-q3",
        type: "MATCH_PAIRS",
        question: "Match the family members: 🧩",
        pairs: [
          { left: "padre", right: "father" },
          { left: "hijo", right: "son" },
          { left: "abuela", right: "grandmother" }
        ],
        correctAnswer: ["padre:father", "hijo:son", "abuela:grandmother"],
        explanation: "Matches: padre = father, hijo = son, abuela = grandmother."
      }
    ]
  },

  // ==========================================
  // --- FRENCH QUIZZES ---
  // ==========================================
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
          { left: "bonjour", right: "Good Morning" },
          { left: "enchanté", right: "nice to meet you" },
          { left: "salut", right: "hi / bye" }
        ],
        correctAnswer: ["bonjour:Good Morning", "enchanté:nice to meet you", "salut:hi / bye"],
        explanation: "Matches: bonjour = Good Morning, enchanté = nice to meet you, salut = hi / bye."
      }
    ]
  },
  {
    id: "fr-quiz-2",
    title: "🍽️ Food & Drinks",
    category: "Food & Drinks",
    language: "fr",
    xpReward: 15,
    questions: [
      {
        id: "fr-q2-q1",
        type: "MULTIPLE_CHOICE",
        question: "What is the French word for 'bread'? 🥖",
        options: ["Eau", "Pain", "Vin", "Lait"],
        correctAnswer: "Pain",
        explanation: "'Pain' means bread. 'Eau' is water, 'Vin' is wine, and 'Lait' is milk."
      },
      {
        id: "fr-q2-q2",
        type: "FILL_BLANK",
        question: "Complete: 'I would like a coffee, please'",
        sentenceWithBlank: "Je voudrais un _____, s'il vous plaît.",
        options: ["café", "pain", "gâteau"],
        correctAnswer: "café",
        explanation: "'Café' means coffee. 'Je voudrais un café' = 'I would like a coffee'."
      },
      {
        id: "fr-q2-q3",
        type: "MATCH_PAIRS",
        question: "Match the food vocabulary: 🧩",
        pairs: [
          { left: "fromage", right: "cheese" },
          { left: "poulet", right: "chicken" },
          { left: "gâteau", right: "cake" }
        ],
        correctAnswer: ["fromage:cheese", "poulet:chicken", "gâteau:cake"],
        explanation: "Matches: fromage = cheese, poulet = chicken, gâteau = cake."
      }
    ]
  },
  {
    id: "fr-quiz-3",
    title: "🔢 Numbers & Math",
    category: "Numbers",
    language: "fr",
    xpReward: 20,
    questions: [
      {
        id: "fr-q3-q1",
        type: "MULTIPLE_CHOICE",
        question: "What is the French word for 'ten'? 🔟",
        options: ["Cinq", "Sept", "Dix", "Huit"],
        correctAnswer: "Dix",
        explanation: "'Dix' means ten. 'Cinq' is five, 'Sept' is seven, and 'Huit' is eight."
      },
      {
        id: "fr-q3-q2",
        type: "FILL_BLANK",
        question: "Complete: 'I am twenty years old'",
        sentenceWithBlank: "J'ai _____ ans.",
        options: ["vingt", "trente", "dix"],
        correctAnswer: "vingt",
        explanation: "'Vingt' means twenty. 'J'ai vingt ans' = 'I am twenty years old'."
      },
      {
        id: "fr-q3-q3",
        type: "MATCH_PAIRS",
        question: "Match the numbers: 🧩",
        pairs: [
          { left: "trois", right: "three" },
          { left: "six", right: "six" },
          { left: "neuf", right: "nine" }
        ],
        correctAnswer: ["trois:three", "six:six", "neuf:nine"],
        explanation: "Matches: trois = three, six = six, neuf = nine."
      }
    ]
  },
  {
    id: "fr-quiz-4",
    title: "🎨 Colors & Adjectives",
    category: "Colors",
    language: "fr",
    xpReward: 20,
    questions: [
      {
        id: "fr-q4-q1",
        type: "MULTIPLE_CHOICE",
        question: "How do you say 'red' in French? 🔴",
        options: ["Bleu", "Vert", "Rouge", "Jaune"],
        correctAnswer: "Rouge",
        explanation: "'Rouge' means red. 'Bleu' is blue, 'Vert' is green, and 'Jaune' is yellow."
      },
      {
        id: "fr-q4-q2",
        type: "FILL_BLANK",
        question: "Complete: 'The sky is blue'",
        sentenceWithBlank: "Le ciel est _____.",
        options: ["bleu", "rouge", "vert"],
        correctAnswer: "bleu",
        explanation: "'Bleu' means blue. 'Le ciel est bleu' = 'The sky is blue'."
      },
      {
        id: "fr-q4-q3",
        type: "MATCH_PAIRS",
        question: "Match the colors: 🧩",
        pairs: [
          { left: "blanc", right: "white" },
          { left: "noir", right: "black" },
          { left: "jaune", right: "yellow" }
        ],
        correctAnswer: ["blanc:white", "noir:black", "jaune:yellow"],
        explanation: "Matches: blanc = white, noir = black, jaune = yellow."
      }
    ]
  },
  {
    id: "fr-quiz-5",
    title: "🕐 Daily Routine",
    category: "Daily Life",
    language: "fr",
    xpReward: 20,
    questions: [
      {
        id: "fr-q5-q1",
        type: "MULTIPLE_CHOICE",
        question: "How do you say 'I wake up' in French? ⏰",
        options: ["Je mange", "Je me réveille", "Je dors", "Je travaille"],
        correctAnswer: "Je me réveille",
        explanation: "'Je me réveille' means 'I wake up'. It is a reflexive verb (se réveiller)."
      },
      {
        id: "fr-q5-q2",
        type: "FILL_BLANK",
        question: "Complete: 'I eat breakfast in the morning'",
        sentenceWithBlank: "Je prends le petit _____ le matin.",
        options: ["déjeuner", "dîner", "goûter"],
        correctAnswer: "déjeuner",
        explanation: "'Petit déjeuner' means breakfast. 'Le matin' means 'in the morning'."
      },
      {
        id: "fr-q5-q3",
        type: "MATCH_PAIRS",
        question: "Match the daily activities: 🧩",
        pairs: [
          { left: "dormir", right: "to sleep" },
          { left: "manger", right: "to eat" },
          { left: "travailler", right: "to work" }
        ],
        correctAnswer: ["dormir:to sleep", "manger:to eat", "travailler:to work"],
        explanation: "Matches: dormir = to sleep, manger = to eat, travailler = to work."
      }
    ]
  },

  // ==========================================
  // --- JAPANESE QUIZZES ---
  // ==========================================
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
  },
  {
    id: "ja-quiz-2",
    title: "🍣 Food & Drinks",
    category: "Food & Drinks",
    language: "ja",
    xpReward: 15,
    questions: [
      {
        id: "ja-q2-q1",
        type: "MULTIPLE_CHOICE",
        question: "What is the Japanese word for 'water'? 💧",
        options: ["おちゃ", "みず", "ごはん", "すし"],
        correctAnswer: "みず",
        explanation: "'Mizu' (みず) means water. 'Ocha' is tea, 'Gohan' is rice/meal, and 'Sushi' is sushi."
      },
      {
        id: "ja-q2-q2",
        type: "FILL_BLANK",
        question: "Complete: 'I will have sushi, please'",
        sentenceWithBlank: "_____をお願いします。",
        options: ["すし", "みず", "ごはん"],
        correctAnswer: "すし",
        explanation: "'Sushi wo onegaishimasu' means 'Sushi, please'. 'お願いします' is a polite request form."
      },
      {
        id: "ja-q2-q3",
        type: "MATCH_PAIRS",
        question: "Match the food words: 🧩",
        pairs: [
          { left: "ごはん", right: "rice / meal" },
          { left: "おちゃ", right: "tea" },
          { left: "たまご", right: "egg" }
        ],
        correctAnswer: ["ごはん:rice / meal", "おちゃ:tea", "たまご:egg"],
        explanation: "Matches: ごはん = rice / meal, おちゃ = tea, たまご = egg."
      }
    ]
  },
  {
    id: "ja-quiz-3",
    title: "🔢 Numbers & Counting",
    category: "Numbers",
    language: "ja",
    xpReward: 20,
    questions: [
      {
        id: "ja-q3-q1",
        type: "MULTIPLE_CHOICE",
        question: "What is the Japanese word for 'three'? 3️⃣",
        options: ["いち", "に", "さん", "よん"],
        correctAnswer: "さん",
        explanation: "'San' (さん) means three. 'Ichi' = one, 'Ni' = two, 'Yon' = four."
      },
      {
        id: "ja-q3-q2",
        type: "FILL_BLANK",
        question: "Complete: 'I have two books'",
        sentenceWithBlank: "本が_____冊あります。",
        options: ["に", "さん", "いち"],
        correctAnswer: "に",
        explanation: "'Ni' (に) means two. 'Hon ga ni-satsu arimasu' = 'I have two books'."
      },
      {
        id: "ja-q3-q3",
        type: "MATCH_PAIRS",
        question: "Match the numbers: 🧩",
        pairs: [
          { left: "いち", right: "one" },
          { left: "ご", right: "five" },
          { left: "じゅう", right: "ten" }
        ],
        correctAnswer: ["いち:one", "ご:five", "じゅう:ten"],
        explanation: "Matches: いち = one, ご = five, じゅう = ten."
      }
    ]
  },
  {
    id: "ja-quiz-4",
    title: "🌸 Colors & Nature",
    category: "Colors",
    language: "ja",
    xpReward: 20,
    questions: [
      {
        id: "ja-q4-q1",
        type: "MULTIPLE_CHOICE",
        question: "How do you say 'red' in Japanese? 🔴",
        options: ["あお", "あか", "しろ", "くろ"],
        correctAnswer: "あか",
        explanation: "'Aka' (あか) means red. 'Ao' is blue, 'Shiro' is white, and 'Kuro' is black."
      },
      {
        id: "ja-q4-q2",
        type: "FILL_BLANK",
        question: "Complete: 'The flower is beautiful'",
        sentenceWithBlank: "花は_____です。",
        options: ["きれい", "おおきい", "ちいさい"],
        correctAnswer: "きれい",
        explanation: "'Kirei' (きれい) means beautiful/pretty. 'Hana wa kirei desu' = 'The flower is beautiful'."
      },
      {
        id: "ja-q4-q3",
        type: "MATCH_PAIRS",
        question: "Match the colors: 🧩",
        pairs: [
          { left: "しろ", right: "white" },
          { left: "くろ", right: "black" },
          { left: "みどり", right: "green" }
        ],
        correctAnswer: ["しろ:white", "くろ:black", "みどり:green"],
        explanation: "Matches: しろ = white, くろ = black, みどり = green."
      }
    ]
  },
  {
    id: "ja-quiz-5",
    title: "🕐 Daily Routine",
    category: "Daily Life",
    language: "ja",
    xpReward: 20,
    questions: [
      {
        id: "ja-q5-q1",
        type: "MULTIPLE_CHOICE",
        question: "How do you say 'I eat' in Japanese? 🍽️",
        options: ["のみます", "たべます", "ねます", "おきます"],
        correctAnswer: "たべます",
        explanation: "'Tabemasu' (たべます) means 'I eat'. 'Nomimasu' = I drink, 'Nemasu' = I sleep."
      },
      {
        id: "ja-q5-q2",
        type: "FILL_BLANK",
        question: "Complete: 'I go to school'",
        sentenceWithBlank: "学校に_____。",
        options: ["いきます", "たべます", "ねます"],
        correctAnswer: "いきます",
        explanation: "'Ikimasu' (いきます) means 'go'. 'Gakkou ni ikimasu' = 'I go to school'."
      },
      {
        id: "ja-q5-q3",
        type: "MATCH_PAIRS",
        question: "Match the daily activities: 🧩",
        pairs: [
          { left: "おきます", right: "to wake up" },
          { left: "ねます", right: "to sleep" },
          { left: "べんきょうします", right: "to study" }
        ],
        correctAnswer: ["おきます:to wake up", "ねます:to sleep", "べんきょうします:to study"],
        explanation: "Matches: おきます = to wake up, ねます = to sleep, べんきょうします = to study."
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
