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
    },
    {
      id: "es-market",
      title: "At the Market",
      icon: "🛒",
      difficulty: "Easy",
      xpReward: 20,
      dialogue: [
        {
          aiText: "¡Buenos días! Bienvenido al mercado. Tenemos frutas frescas hoy. ¿Qué necesitas? 🍊",
          translation: "Good morning! Welcome to the market. We have fresh fruits today. What do you need?",
          suggestions: [
            { text: "Hola, necesito manzanas y plátanos.", translation: "Hello, I need apples and bananas." },
            { text: "Buenos días, ¿tiene naranjas frescas?", translation: "Good morning, do you have fresh oranges?" }
          ]
        },
        {
          aiText: "¡Claro que sí! Las naranjas están muy dulces hoy. ¿Cuántas quieres?",
          translation: "Of course! The oranges are very sweet today. How many do you want?",
          suggestions: [
            { text: "Quiero cinco naranjas, por favor.", translation: "I want five oranges, please." },
            { text: "Dame un kilo de naranjas.", translation: "Give me a kilo of oranges." }
          ]
        },
        {
          aiText: "Perfecto. ¿Necesitas algo más? Tenemos verduras también. 🥦",
          translation: "Perfect. Do you need anything else? We have vegetables too.",
          suggestions: [
            { text: "Sí, también necesito tomates y cebollas.", translation: "Yes, I also need tomatoes and onions." },
            { text: "No, eso es todo. ¿Cuánto cuesta?", translation: "No, that's all. How much does it cost?" }
          ]
        },
        {
          aiText: "Son tres euros con cincuenta. ¿Necesitas una bolsa? 🛍️",
          translation: "That's three euros and fifty cents. Do you need a bag?",
          suggestions: [
            { text: "Sí, una bolsa por favor.", translation: "Yes, a bag please." },
            { text: "No, traigo mi propia bolsa.", translation: "No, I brought my own bag." }
          ]
        },
        {
          aiText: "¡Excelente! Aquí tienes. ¡Que disfrutes la comida! ¡Hasta pronto! 🎉",
          translation: "Excellent! Here you go. Enjoy the food! See you soon!",
          suggestions: [
            { text: "Muchas gracias. ¡Hasta luego!", translation: "Thank you very much. See you later!" },
            { text: "¡Gracias! Volveré mañana.", translation: "Thanks! I'll come back tomorrow." }
          ]
        }
      ]
    },
    {
      id: "es-doctor",
      title: "At the Doctor",
      icon: "🏥",
      difficulty: "Medium",
      xpReward: 25,
      dialogue: [
        {
          aiText: "Buenos días, soy la doctora García. ¿Cómo se siente hoy? ¿Qué le pasa? 🩺",
          translation: "Good morning, I'm Dr. García. How are you feeling today? What's wrong?",
          suggestions: [
            { text: "Buenos días, doctora. Me duele la cabeza.", translation: "Good morning, doctor. I have a headache." },
            { text: "Hola, no me siento bien. Tengo fiebre.", translation: "Hello, I don't feel well. I have a fever." }
          ]
        },
        {
          aiText: "Entiendo. ¿Desde cuándo tiene estos síntomas? ¿Ha tomado algún medicamento?",
          translation: "I understand. Since when have you had these symptoms? Have you taken any medication?",
          suggestions: [
            { text: "Desde ayer por la mañana. No he tomado nada.", translation: "Since yesterday morning. I haven't taken anything." },
            { text: "Desde hace dos días. Tomé aspirina.", translation: "For two days. I took aspirin." }
          ]
        },
        {
          aiText: "Le voy a recetar este medicamento. Tómelo dos veces al día con comida. 💊",
          translation: "I'm going to prescribe this medication. Take it twice a day with food.",
          suggestions: [
            { text: "Gracias, doctora. ¿Algo más que deba hacer?", translation: "Thank you, doctor. Anything else I should do?" },
            { text: "¿Por cuántos días debo tomarlo?", translation: "For how many days should I take it?" }
          ]
        },
        {
          aiText: "Descanse mucho y beba bastante agua. Si no mejora en tres días, vuelva a visitarme. 💧",
          translation: "Rest a lot and drink plenty of water. If you don't improve in three days, come back.",
          suggestions: [
            { text: "Entendido, seguiré sus indicaciones.", translation: "Understood, I'll follow your instructions." },
            { text: "Muchas gracias por su ayuda, doctora.", translation: "Thank you very much for your help, doctor." }
          ]
        },
        {
          aiText: "De nada. ¡Que se mejore pronto! Cuídese mucho. 🌟",
          translation: "You're welcome. Get well soon! Take care!",
          suggestions: [
            { text: "Gracias, hasta luego.", translation: "Thank you, see you later." },
            { text: "¡Adiós! Gracias por todo.", translation: "Goodbye! Thanks for everything." }
          ]
        }
      ]
    },
    {
      id: "es-hotel",
      title: "Hotel Check-in",
      icon: "🏨",
      difficulty: "Medium",
      xpReward: 25,
      dialogue: [
        {
          aiText: "¡Buenas tardes! Bienvenido al Hotel Sol. ¿Tiene una reservación? 🏨",
          translation: "Good afternoon! Welcome to Hotel Sol. Do you have a reservation?",
          suggestions: [
            { text: "Sí, tengo una reservación a nombre de López.", translation: "Yes, I have a reservation under the name López." },
            { text: "No, ¿tienen habitaciones disponibles?", translation: "No, do you have any rooms available?" }
          ]
        },
        {
          aiText: "Perfecto, encontré su reservación. Una habitación doble por tres noches. ¿Es correcto?",
          translation: "Perfect, I found your reservation. A double room for three nights. Is that correct?",
          suggestions: [
            { text: "Sí, es correcto. ¿Incluye desayuno?", translation: "Yes, that's correct. Does it include breakfast?" },
            { text: "Sí, ¿a qué hora es el check-out?", translation: "Yes, what time is checkout?" }
          ]
        },
        {
          aiText: "El desayuno es de siete a diez. El check-out es a las doce. Su habitación es la 305. 🔑",
          translation: "Breakfast is from seven to ten. Checkout is at twelve. Your room is 305.",
          suggestions: [
            { text: "Perfecto, muchas gracias.", translation: "Perfect, thank you very much." },
            { text: "¿Tienen servicio de Wi-Fi?", translation: "Do you have Wi-Fi service?" }
          ]
        },
        {
          aiText: "Sí, el Wi-Fi es gratis. La contraseña está en su tarjeta. ¿Necesita algo más?",
          translation: "Yes, Wi-Fi is free. The password is on your card. Do you need anything else?",
          suggestions: [
            { text: "¿Dónde está el ascensor?", translation: "Where is the elevator?" },
            { text: "¿Pueden subir mi equipaje?", translation: "Can you bring up my luggage?" }
          ]
        },
        {
          aiText: "El ascensor está al final del pasillo. ¡Que disfrute su estancia! 🌟",
          translation: "The elevator is at the end of the hallway. Enjoy your stay!",
          suggestions: [
            { text: "Muchas gracias por su amabilidad.", translation: "Thank you very much for your kindness." },
            { text: "¡Gracias! Estoy muy contento.", translation: "Thanks! I'm very happy." }
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
    },
    {
      id: "fr-boulangerie",
      title: "À la Boulangerie",
      icon: "🥐",
      difficulty: "Easy",
      xpReward: 20,
      dialogue: [
        {
          aiText: "Bonjour ! Bienvenue à notre boulangerie. Qu'est-ce qui vous ferait plaisir aujourd'hui ? 🥐",
          translation: "Hello! Welcome to our bakery. What would you like today?",
          suggestions: [
            { text: "Bonjour, je voudrais deux croissants, s'il vous plaît.", translation: "Hello, I would like two croissants, please." },
            { text: "Bonjour ! Avez-vous du pain frais ?", translation: "Hello! Do you have fresh bread?" }
          ]
        },
        {
          aiText: "Bien sûr ! Nos croissants sont tout chauds. Voulez-vous aussi une baguette ?",
          translation: "Of course! Our croissants are hot. Would you also like a baguette?",
          suggestions: [
            { text: "Oui, une baguette tradition, s'il vous plaît.", translation: "Yes, a traditional baguette, please." },
            { text: "Non merci, juste les croissants.", translation: "No thank you, just the croissants." }
          ]
        },
        {
          aiText: "Excellent choix ! Voulez-vous goûter notre tarte aux pommes ? Elle est faite maison. 🍎",
          translation: "Excellent choice! Would you like to try our apple tart? It's homemade.",
          suggestions: [
            { text: "Oh oui, elle a l'air délicieuse !", translation: "Oh yes, it looks delicious!" },
            { text: "Non merci, ce sera tout.", translation: "No thank you, that will be all." }
          ]
        },
        {
          aiText: "Très bien ! Cela fait sept euros cinquante. Comment souhaitez-vous payer ? 💳",
          translation: "Very well! That's seven euros fifty. How would you like to pay?",
          suggestions: [
            { text: "Par carte, s'il vous plaît.", translation: "By card, please." },
            { text: "En espèces. Voici dix euros.", translation: "In cash. Here's ten euros." }
          ]
        },
        {
          aiText: "Merci beaucoup ! Voici vos viennoiseries. Bonne journée et bon appétit ! 🌟",
          translation: "Thank you! Here are your pastries. Good day and enjoy!",
          suggestions: [
            { text: "Merci beaucoup ! À demain !", translation: "Thank you! See you tomorrow!" },
            { text: "Au revoir et bonne journée !", translation: "Goodbye and have a good day!" }
          ]
        }
      ]
    },
    {
      id: "fr-pharmacie",
      title: "À la Pharmacie",
      icon: "💊",
      difficulty: "Medium",
      xpReward: 25,
      dialogue: [
        {
          aiText: "Bonjour ! Bienvenue à la pharmacie. Comment puis-je vous aider ? 💊",
          translation: "Hello! Welcome to the pharmacy. How can I help you?",
          suggestions: [
            { text: "Bonjour, j'ai mal à la tête depuis ce matin.", translation: "Hello, I've had a headache since this morning." },
            { text: "Bonjour, j'ai besoin de quelque chose contre le rhume.", translation: "Hello, I need something for a cold." }
          ]
        },
        {
          aiText: "Je comprends. Avez-vous de la fièvre ou d'autres symptômes ?",
          translation: "I understand. Do you have a fever or other symptoms?",
          suggestions: [
            { text: "Oui, j'ai un peu de fièvre et le nez bouché.", translation: "Yes, I have a slight fever and a stuffy nose." },
            { text: "Non, juste un mal de tête persistant.", translation: "No, just a persistent headache." }
          ]
        },
        {
          aiText: "Je vous recommande ce médicament. Prenez-en un comprimé matin et soir. 🩺",
          translation: "I recommend this medication. Take one tablet morning and evening.",
          suggestions: [
            { text: "D'accord, merci. Pendant combien de jours ?", translation: "Okay, thank you. For how many days?" },
            { text: "Est-ce que je peux le prendre sans manger ?", translation: "Can I take it without eating?" }
          ]
        },
        {
          aiText: "Prenez-le pendant cinq jours avec un repas. Buvez beaucoup d'eau aussi. 💧",
          translation: "Take it for five days with a meal. Drink plenty of water too.",
          suggestions: [
            { text: "Compris, merci pour vos conseils.", translation: "Understood, thank you for your advice." },
            { text: "Combien cela coûte-t-il ?", translation: "How much does it cost?" }
          ]
        },
        {
          aiText: "C'est huit euros. Rétablissez-vous vite ! N'hésitez pas à revenir. 🌟",
          translation: "It's eight euros. Get well soon! Don't hesitate to come back.",
          suggestions: [
            { text: "Merci beaucoup, au revoir !", translation: "Thank you very much, goodbye!" },
            { text: "Merci, bonne journée !", translation: "Thank you, have a good day!" }
          ]
        }
      ]
    },
    {
      id: "fr-gare",
      title: "À la Gare",
      icon: "🚂",
      difficulty: "Medium",
      xpReward: 25,
      dialogue: [
        {
          aiText: "Bonjour ! Bienvenue au guichet de la gare. Où souhaitez-vous aller ? 🚂",
          translation: "Hello! Welcome to the train station counter. Where would you like to go?",
          suggestions: [
            { text: "Bonjour, je voudrais un billet pour Lyon.", translation: "Hello, I would like a ticket to Lyon." },
            { text: "Bonjour, à quelle heure part le prochain train pour Marseille ?", translation: "Hello, what time does the next train to Marseille leave?" }
          ]
        },
        {
          aiText: "Le prochain train part à quatorze heures trente. Voulez-vous un aller simple ou un aller-retour ?",
          translation: "The next train leaves at 2:30 PM. Would you like a one-way or round trip?",
          suggestions: [
            { text: "Un aller-retour, s'il vous plaît.", translation: "A round trip, please." },
            { text: "Un aller simple suffit, merci.", translation: "A one-way ticket is enough, thank you." }
          ]
        },
        {
          aiText: "Première ou deuxième classe ? Le voyage dure environ deux heures. 🎫",
          translation: "First or second class? The trip takes about two hours.",
          suggestions: [
            { text: "Deuxième classe, s'il vous plaît.", translation: "Second class, please." },
            { text: "Première classe. C'est combien ?", translation: "First class. How much is it?" }
          ]
        },
        {
          aiText: "Deuxième classe, c'est quarante-cinq euros. Votre train partira du quai numéro trois.",
          translation: "Second class is forty-five euros. Your train will depart from platform three.",
          suggestions: [
            { text: "Parfait, voici ma carte.", translation: "Perfect, here is my card." },
            { text: "Merci ! Où est le quai numéro trois ?", translation: "Thank you! Where is platform three?" }
          ]
        },
        {
          aiText: "Le quai trois est tout droit, à gauche après le panneau. Bon voyage ! 🌟",
          translation: "Platform three is straight ahead, left after the sign. Have a nice trip!",
          suggestions: [
            { text: "Merci beaucoup ! Au revoir !", translation: "Thank you very much! Goodbye!" },
            { text: "Merci, bonne journée !", translation: "Thank you, have a good day!" }
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
    },
    {
      id: "ja-konbini",
      title: "コンビニで (Convenience Store)",
      icon: "🏪",
      difficulty: "Easy",
      xpReward: 20,
      dialogue: [
        {
          aiText: "いらっしゃいませ！何かお探しですか？ 🏪",
          translation: "Welcome! Are you looking for something?",
          suggestions: [
            { text: "すみません、おにぎりはどこですか？", translation: "Excuse me, where are the rice balls?" },
            { text: "こんにちは、お弁当はありますか？", translation: "Hello, do you have bento boxes?" }
          ]
        },
        {
          aiText: "おにぎりは冷蔵コーナーにございます。新しい味もありますよ！🍙",
          translation: "The rice balls are in the refrigerated section. We have new flavors too!",
          suggestions: [
            { text: "ありがとうございます！鮭のおにぎりをください。", translation: "Thank you! I'll have a salmon rice ball." },
            { text: "どの味がおすすめですか？", translation: "Which flavor do you recommend?" }
          ]
        },
        {
          aiText: "梅味がとても人気ですよ。飲み物もいかがですか？🥤",
          translation: "The plum flavor is very popular. Would you also like a drink?",
          suggestions: [
            { text: "はい、緑茶を一本ください。", translation: "Yes, one green tea please." },
            { text: "いいえ、大丈夫です。これだけで。", translation: "No, I'm fine. Just this." }
          ]
        },
        {
          aiText: "かしこまりました。全部で350円になります。袋はいりますか？🛍️",
          translation: "Understood. That will be 350 yen total. Do you need a bag?",
          suggestions: [
            { text: "はい、袋をお願いします。", translation: "Yes, a bag please." },
            { text: "いいえ、袋はいりません。", translation: "No, I don't need a bag." }
          ]
        },
        {
          aiText: "ありがとうございます！またお越しくださいませ！🌟",
          translation: "Thank you! Please come again!",
          suggestions: [
            { text: "ありがとう、また来ます！", translation: "Thank you, I'll come again!" },
            { text: "ごちそうさまです、さようなら！", translation: "Thanks for the food, goodbye!" }
          ]
        }
      ]
    },
    {
      id: "ja-michi",
      title: "道を聞く (Asking Directions)",
      icon: "🗺️",
      difficulty: "Medium",
      xpReward: 25,
      dialogue: [
        {
          aiText: "こんにちは！迷っているようですね。何かお手伝いしましょうか？ 🗺️",
          translation: "Hello! You seem lost. Can I help you with something?",
          suggestions: [
            { text: "はい、駅はどこですか？", translation: "Yes, where is the station?" },
            { text: "すみません、この近くに銀行はありますか？", translation: "Excuse me, is there a bank nearby?" }
          ]
        },
        {
          aiText: "駅ですね。ここからまっすぐ行って、二つ目の信号を右に曲がってください。",
          translation: "The station, right? Go straight from here and turn right at the second traffic light.",
          suggestions: [
            { text: "まっすぐ行って、右ですね。わかりました！", translation: "Straight and then right. Got it!" },
            { text: "すみません、歩いてどのくらいかかりますか？", translation: "Excuse me, how long does it take on foot?" }
          ]
        },
        {
          aiText: "歩いて約十分くらいです。大きな建物が見えたら、駅はすぐそこです。🚶",
          translation: "About ten minutes on foot. When you see a large building, the station is right there.",
          suggestions: [
            { text: "十分ですね。ありがとうございます！", translation: "Ten minutes, right. Thank you!" },
            { text: "バスで行くこともできますか？", translation: "Can I also go by bus?" }
          ]
        },
        {
          aiText: "はい、このバス停から三番のバスに乗れば、三分で着きますよ。🚌",
          translation: "Yes, if you take bus number 3 from this bus stop, you'll arrive in three minutes.",
          suggestions: [
            { text: "バスの方が早いですね。バスにします！", translation: "The bus is faster. I'll take the bus!" },
            { text: "歩いて行きます。天気がいいので。", translation: "I'll walk. The weather is nice." }
          ]
        },
        {
          aiText: "いい選択ですね！気をつけて行ってくださいね。よい一日を！🌟",
          translation: "Good choice! Please be careful on your way. Have a nice day!",
          suggestions: [
            { text: "ありがとうございました！助かりました！", translation: "Thank you very much! You were a great help!" },
            { text: "本当にありがとう！よい一日を！", translation: "Thank you so much! Have a nice day!" }
          ]
        }
      ]
    },
    {
      id: "ja-restaurant",
      title: "レストランで (Restaurant)",
      icon: "🍜",
      difficulty: "Medium",
      xpReward: 25,
      dialogue: [
        {
          aiText: "いらっしゃいませ！何名様ですか？ 🍜",
          translation: "Welcome! How many people?",
          suggestions: [
            { text: "二人です。テーブル席はありますか？", translation: "Two people. Do you have a table?" },
            { text: "一人です。カウンターでお願いします。", translation: "Just one. Counter seat, please." }
          ]
        },
        {
          aiText: "はい、こちらへどうぞ。メニューです。ご注文はお決まりですか？📋",
          translation: "Yes, this way please. Here's the menu. Are you ready to order?",
          suggestions: [
            { text: "少し待ってください。おすすめは何ですか？", translation: "Please wait a moment. What do you recommend?" },
            { text: "はい、ラーメンをお願いします。", translation: "Yes, I'll have ramen please." }
          ]
        },
        {
          aiText: "今日のおすすめは味噌ラーメンと餃子セットです。とても美味しいですよ！🥟",
          translation: "Today's recommendation is the miso ramen and gyoza set. It's very delicious!",
          suggestions: [
            { text: "じゃあ、それをお願いします！", translation: "Then I'll have that, please!" },
            { text: "味噌ラーメンと、ビールも一つください。", translation: "Miso ramen and one beer, please." }
          ]
        },
        {
          aiText: "かしこまりました。お飲み物は先にお持ちしますね。少々お待ちください。🍺",
          translation: "Understood. I'll bring your drink first. Please wait a moment.",
          suggestions: [
            { text: "ありがとうございます。楽しみです！", translation: "Thank you. I'm looking forward to it!" },
            { text: "はい、お願いします。", translation: "Yes, please." }
          ]
        },
        {
          aiText: "お待たせしました！ごゆっくりどうぞ。ごちそうさまでした、と言ったらお会計ですよ。🌟",
          translation: "Sorry for the wait! Please take your time. Say 'Gochisousama' when you're ready for the bill.",
          suggestions: [
            { text: "いただきます！とても美味しそうです！", translation: "Let's eat! It looks very delicious!" },
            { text: "ありがとうございます！いただきます！", translation: "Thank you! Let's eat!" }
          ]
        }
      ]
    }
  ]
};
