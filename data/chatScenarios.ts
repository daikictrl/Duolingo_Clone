export interface DialogueTurn {
  aiText: string;
  translation: string;
  suggestions: {
    text: string;
    translation: string;
  }[];
}

export interface ChatScenario {
  id: string;
  title: string;
  icon: string;
  difficulty: "Beginner" | "Easy" | "Medium";
  xpReward: number;
  dialogue: DialogueTurn[];
}

export const chatScenarios: Record<string, ChatScenario[]> = {
  es: [
    {
      id: "es-cafe",
      title: "At the Café",
      icon: "☕",
      difficulty: "Beginner",
      xpReward: 15,
      dialogue: [
        {
          aiText: "¡Hola! Bienvenido al Café Sol. ¿Qué deseas tomar hoy? ☕",
          translation: "Hello! Welcome to Cafe Sol. What would you like to drink today?",
          suggestions: [
            {
              text: "Hola, quiero un café por favor.",
              translation: "Hello, I want a coffee please."
            },
            {
              text: "Buenas tardes, ¿qué me recomienda?",
              translation: "Good afternoon, what do you recommend?"
            }
          ]
        },
        {
          aiText: "Te recomiendo nuestro café con leche y una empanada dulce. ¿Te gustaría probarlos?",
          translation: "I recommend our coffee with milk and a sweet empanada. Would you like to try them?",
          suggestions: [
            {
              text: "Sí, por favor, con leche de avena.",
              translation: "Yes, please, with oat milk."
            },
            {
              text: "No, gracias. Solo un té negro.",
              translation: "No, thank you. Just a black tea."
            }
          ]
        },
        {
          aiText: "Perfecto. ¿Para tomar aquí o para llevar? 🥤",
          translation: "Perfect. For here or to go?",
          suggestions: [
            {
              text: "Para tomar aquí, por favor.",
              translation: "For here, please."
            },
            {
              text: "Para llevar, gracias.",
              translation: "To go, thank you."
            }
          ]
        },
        {
          aiText: "Muy bien, serán 4 euros. ¿Pagas con tarjeta o efectivo? 💳",
          translation: "Very well, it will be 4 euros. Do you pay with card or cash?",
          suggestions: [
            {
              text: "Pago con tarjeta de crédito.",
              translation: "I pay with credit card."
            },
            {
              text: "Pago en efectivo, aquí tiene.",
              translation: "I pay in cash, here you go."
            }
          ]
        },
        {
          aiText: "¡Excelente! Aquí tienes tu pedido. Que tengas un buen día. ¡Disfruta! 🥐",
          translation: "Excellent! Here is your order. Have a good day. Enjoy!",
          suggestions: [
            {
              text: "Muchas gracias, igualmente.",
              translation: "Thank you very much, same to you."
            },
            {
              text: "¡Gracias! Adiós.",
              translation: "Thank you! Goodbye."
            }
          ]
        }
      ]
    },
    {
      id: "es-hello",
      title: "Saying Hello",
      icon: "👋",
      difficulty: "Beginner",
      xpReward: 15,
      dialogue: [
        {
          aiText: "¡Hola! Me llamo Vexora. ¿Cómo te llamas y de dónde eres? 👋",
          translation: "Hello! My name is Vexora. What is your name and where are you from?",
          suggestions: [
            {
              text: "Hola Vexora, me llamo Juan y soy de España.",
              translation: "Hello Vexora, my name is Juan and I am from Spain."
            },
            {
              text: "Mucho gusto, soy Sophia y vivo en Nueva York.",
              translation: "Nice to meet you, I am Sophia and I live in New York."
            }
          ]
        },
        {
          aiText: "¡Qué bien! Es un placer conocerte. ¿Qué te gusta hacer en tu tiempo libre?",
          translation: "Great! It is a pleasure to meet you. What do you like to do in your free time?",
          suggestions: [
            {
              text: "Me gusta leer libros y escuchar música.",
              translation: "I like reading books and listening to music."
            },
            {
              text: "Me encanta hacer deporte y cocinar.",
              translation: "I love playing sports and cooking."
            }
          ]
        },
        {
          aiText: "¡Qué interesante! Yo también disfruto de la buena música. ¿Qué idioma estás practicando hoy?",
          translation: "How interesting! I also enjoy good music. What language are you practicing today?",
          suggestions: [
            {
              text: "Estoy practicando español contigo.",
              translation: "I am practicing Spanish with you."
            },
            {
              text: "Quiero aprender más vocabulario.",
              translation: "I want to learn more vocabulary."
            }
          ]
        },
        {
          aiText: "¡Lo estás haciendo genial! El español es un idioma hermoso. ¿Tienes algún plan para este fin de semana?",
          translation: "You are doing great! Spanish is a beautiful language. Do you have any plans for this weekend?",
          suggestions: [
            {
              text: "Sí, voy a visitar a mi familia.",
              translation: "Yes, I am going to visit my family."
            },
            {
              text: "No, voy a descansar en casa.",
              translation: "No, I am going to rest at home."
            }
          ]
        },
        {
          aiText: "Suena como un plan perfecto. ¡Ha sido una gran conversación! Sigue practicando. ¡Adiós! 🌟",
          translation: "Sounds like a perfect plan. It has been a great conversation! Keep practicing. Goodbye!",
          suggestions: [
            {
              text: "Muchas gracias por tu ayuda. ¡Hasta luego!",
              translation: "Thank you very much for your help. See you later!"
            },
            {
              text: "¡Adiós, Vexora!",
              translation: "Goodbye, Vexora!"
            }
          ]
        }
      ]
    }
  ],
  fr: [
    {
      id: "fr-cafe",
      title: "Au Café",
      icon: "☕",
      difficulty: "Beginner",
      xpReward: 15,
      dialogue: [
        {
          aiText: "Bonjour ! Bienvenue au Café de Flore. Que désirez-vous commander aujourd'hui ? ☕",
          translation: "Hello! Welcome to Cafe de Flore. What would you like to order today?",
          suggestions: [
            {
              text: "Bonjour, je voudrais un croissant et un café, s'il vous plaît.",
              translation: "Hello, I would like a croissant and a coffee, please."
            },
            {
              text: "Bonjour ! Qu'est-ce que vous me conseillez ?",
              translation: "Hello! What do you recommend?"
            }
          ]
        },
        {
          aiText: "Je vous conseille notre pain au chocolat tout chaud avec un café crème. C'est excellent !",
          translation: "I recommend our warm pain au chocolat with a coffee cream. It is excellent!",
          suggestions: [
            {
              text: "Oui, s'il vous plaît, avec du lait d'avoine.",
              translation: "Yes, please, with oat milk."
            },
            {
              text: "Non merci. Juste un espresso simple.",
              translation: "No thank you. Just a single espresso."
            }
          ]
        },
        {
          aiText: "Très bien. Sur place ou à emporter ? 🥤",
          translation: "Very well. For here or to go?",
          suggestions: [
            {
              text: "Sur place, s'il vous plaît.",
              translation: "For here, please."
            },
            {
              text: "À emporter, merci.",
              translation: "To go, thank you."
            }
          ]
        },
        {
          aiText: "D'accord, cela fera 5 euros. Vous réglez par carte ou en espèces ? 💳",
          translation: "Okay, that will be 5 euros. Do you pay by card or in cash?",
          suggestions: [
            {
              text: "Par carte de crédit, s'il vous plaît.",
              translation: "By credit card, please."
            },
            {
              text: "En espèces, voici un billet.",
              translation: "In cash, here is a bill."
            }
          ]
        },
        {
          aiText: "Parfait ! Voici votre commande. Bonne journée et bon appétit ! 🥐",
          translation: "Perfect! Here is your order. Good day and enjoy your meal!",
          suggestions: [
            {
              text: "Merci beaucoup, bonne journée à vous aussi !",
              translation: "Thank you very much, good day to you too!"
            },
            {
              text: "Merci, au revoir !",
              translation: "Thank you, goodbye!"
            }
          ]
        }
      ]
    },
    {
      id: "fr-hello",
      title: "Les Salutations",
      icon: "👋",
      difficulty: "Beginner",
      xpReward: 15,
      dialogue: [
        {
          aiText: "Salut ! Je m'appelle Vexora. Comment tu t'appelles et d'ou viens-tu ? 👋",
          translation: "Hi! My name is Vexora. What is your name and where do you come from?",
          suggestions: [
            {
              text: "Salut Vexora, je m'appelle Thomas et je suis américain.",
              translation: "Hi Vexora, my name is Thomas and I am American."
            },
            {
              text: "Enchanté, je m'appelle Emma et je viens du Canada.",
              translation: "Nice to meet you, my name is Emma and I come from Canada."
            }
          ]
        },
        {
          aiText: "Enchanté ! C'est un plaisir. Qu'est-ce que tu aimes faire pendant ton temps libre ?",
          translation: "Nice to meet you! It's a pleasure. What do you like to do in your free time?",
          suggestions: [
            {
              text: "J'aime écouter de la musique et lire.",
              translation: "I like listening to music and reading."
            },
            {
              text: "J'adore faire du sport et cuisiner.",
              translation: "I love playing sports and cooking."
            }
          ]
        },
        {
          aiText: "C'est super ! J'aime beaucoup la lecture aussi. Quelle langue apprends-tu en ce moment ?",
          translation: "That's great! I like reading a lot too. Which language are you learning at the moment?",
          suggestions: [
            {
              text: "J'apprends le français avec toi.",
              translation: "I am learning French with you."
            },
            {
              text: "Je veux améliorer mon vocabulaire.",
              translation: "I want to improve my vocabulary."
            }
          ]
        },
        {
          aiText: "Tu te débrouilles très bien ! Le français est une belle langue. As-tu des projets pour ce week-end ?",
          translation: "You are doing very well! French is a beautiful language. Do you have plans for this weekend?",
          suggestions: [
            {
              text: "Oui, je vais voir des amis.",
              translation: "Yes, I am going to see some friends."
            },
            {
              text: "Non, je vais me reposer chez moi.",
              translation: "No, I am going to rest at home."
            }
          ]
        },
        {
          aiText: "Ça a l'air parfait. C'était un plaisir de discuter avec toi ! Continue comme ça. Salut ! 🌟",
          translation: "That sounds perfect. It was a pleasure chatting with you! Keep it up. Bye!",
          suggestions: [
            {
              text: "Merci beaucoup pour ton aide. À bientôt !",
              translation: "Thank you very much for your help. See you soon!"
            },
            {
              text: "Au revoir Vexora !",
              translation: "Goodbye Vexora!"
            }
          ]
        }
      ]
    }
  ],
  ja: [
    {
      id: "ja-cafe",
      title: "カフェで (At the Café)",
      icon: "☕",
      difficulty: "Beginner",
      xpReward: 15,
      dialogue: [
        {
          aiText: "いらっしゃいませ！さくらカフェへようこそ。本日は何にいたしますか？ ☕",
          translation: "Welcome! Welcome to Sakura Cafe. What would you like today?",
          suggestions: [
            {
              text: "こんにちは、ホットコーヒーを一つお願いします。",
              translation: "Hello, hot coffee please."
            },
            {
              text: "こんにちは！おすすめは何ですか？",
              translation: "Hello! What is your recommendation?"
            }
          ]
        },
        {
          aiText: "本日のおすすめは、特製の抹茶ラテとイチゴ大福です。いかがですか？",
          translation: "Today's recommendation is our special matcha latte and strawberry daifuku. How about it?",
          suggestions: [
            {
              text: "はい、抹茶ラテをお願いします。",
              translation: "Yes, matcha latte please."
            },
            {
              text: "いいえ、普通の紅茶をください。",
              translation: "No, please give me a normal black tea."
            }
          ]
        },
        {
          aiText: "かしこまりました。店内でお召し上がりですか、お持ち帰りですか？ 🥤",
          translation: "Understood. Dining in, or to go?",
          suggestions: [
            {
              text: "店内でお願いします。",
              translation: "Dining in, please."
            },
            {
              text: "お持ち帰りでお願いします。",
              translation: "To go, please."
            }
          ]
        },
        {
          aiText: "ありがとうございます。全部で500円です。カードですか、現金ですか？ 💳",
          translation: "Thank you. It is 500 yen in total. Card or cash?",
          suggestions: [
            {
              text: "クレジットカードで払います。",
              translation: "I'll pay with a credit card."
            },
            {
              text: "現金で払います、はいどうぞ。",
              translation: "I'll pay in cash, here you go."
            }
          ]
        },
        {
          aiText: "ありがとうございます！お待たせいたしました。どうぞごゆっくり。 🥐",
          translation: "Thank you! Sorry to keep you waiting. Please enjoy your time.",
          suggestions: [
            {
              text: "どうもありがとうございました。",
              translation: "Thank you very much."
            },
            {
              text: "いただきます、ありがとう！",
              translation: "I'll eat it, thank you!"
            }
          ]
        }
      ]
    },
    {
      id: "ja-hello",
      title: "自己紹介 (Introduction)",
      icon: "👋",
      difficulty: "Beginner",
      xpReward: 15,
      dialogue: [
        {
          aiText: "こんにちは！はじめまして、ヴェゾラです。お名前と出身はどちらですか？ 👋",
          translation: "Hello! Nice to meet you, I'm Vexora. What is your name and where are you from?",
          suggestions: [
            {
              text: "こんにちは！私はタカシです。日本から来ました。",
              translation: "Hello! I am Takashi. I came from Japan."
            },
            {
              text: "はじめまして、サラです。オーストラリア出身です。",
              translation: "Nice to meet you, I'm Sarah. I'm from Australia."
            }
          ]
        },
        {
          aiText: "よろしくおねがいします！趣味は何ですか？暇なときは何をしますか？",
          translation: "Nice to meet you! What is your hobby? What do you do in your free time?",
          suggestions: [
            {
              text: "音楽を聴くことと、本を読むことです。",
              translation: "Listening to music and reading books."
            },
            {
              text: "スポーツをすることと、料理が好きです。",
              translation: "Playing sports and I like cooking."
            }
          ]
        },
        {
          aiText: "いいですね！私も本を読むのが大好きです。日本語の勉強はどうですか？",
          translation: "Great! I also love reading books. How is your Japanese studying?",
          suggestions: [
            {
              text: "日本語の勉強は楽しいですが、少し難しいです。",
              translation: "Studying Japanese is fun, but a little difficult."
            },
            {
              text: "もっとたくさん話せるようになりたいです。",
              translation: "I want to become able to speak much more."
            }
          ]
        },
        {
          aiText: "素晴らしいですね！とても上手ですよ。今週末は何か予定がありますか？",
          translation: "Wonderful! You are very good. Do you have any plans this weekend?",
          suggestions: [
            {
              text: "はい、友達と遊びに行きます。",
              translation: "Yes, I will go hang out with my friends."
            },
            {
              text: "いいえ、家でゆっくり休みます。",
              translation: "No, I will take a good rest at home."
            }
          ]
        },
        {
          aiText: "楽しそうな週末ですね！今日はたくさん話せて嬉しかったです。またね！ 🌟",
          translation: "Sounds like a fun weekend! I was happy to talk a lot today. See you!",
          suggestions: [
            {
              text: "ありがとうございました。またね！",
              translation: "Thank you very much. See you!"
            },
            {
              text: "楽しかったです、バイバイ！",
              translation: "It was fun, bye bye!"
            }
          ]
        }
      ]
    }
  ]
};
