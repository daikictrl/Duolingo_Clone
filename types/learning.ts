export type ActivityType =
  | "MULTIPLE_CHOICE"
  | "TRANSLATE_SENTENCE"
  | "MATCH_PAIRS"
  | "FILL_BLANK"
  | "LISTEN_COMPLETE"
  | "SPEAK_PHRASE";

export interface BaseActivity {
  id: string;
  type: ActivityType;
  prompt: string; // E.g., "Translate this sentence", "Select the correct translation"
  question: string; // The main text or audio prompt (e.g. "Hola", "The cat drinks milk")
  correctAnswer: string | string[]; // The correct answer or array of acceptable answers
  xpReward: number;
}

export interface MultipleChoiceActivity extends BaseActivity {
  type: "MULTIPLE_CHOICE";
  options: string[]; // Options to display
}

export interface TranslateSentenceActivity extends BaseActivity {
  type: "TRANSLATE_SENTENCE";
  wordBank: string[]; // Scrambled words to build the sentence
}

export interface MatchPairsActivity extends BaseActivity {
  type: "MATCH_PAIRS";
  pairs: { left: string; right: string }[]; // E.g., [{left: "hola", right: "hello"}]
}

export interface FillBlankActivity extends BaseActivity {
  type: "FILL_BLANK";
  sentenceWithBlank: string; // E.g., "El gato _____ leche."
  options: string[]; // Choices to fill the blank
}

export interface ListenCompleteActivity extends BaseActivity {
  type: "LISTEN_COMPLETE";
  audioUrl?: string; // Optional audio file reference or key
  textToShow?: string; // Optional text reference
}

export interface SpeakPhraseActivity extends BaseActivity {
  type: "SPEAK_PHRASE";
  phoneticTip?: string;
}

export type Activity =
  | MultipleChoiceActivity
  | TranslateSentenceActivity
  | MatchPairsActivity
  | FillBlankActivity
  | ListenCompleteActivity
  | SpeakPhraseActivity;

export interface Language {
  id: string; // E.g., "es", "fr", "ja"
  name: string; // E.g., "Spanish"
  nativeName: string; // E.g., "Español"
  flag: string; // Emoji character, asset path, or URL link
  color?: string; // Hex color code representing the language theme
  description: string;
}

export interface Vocabulary {
  id: string;
  languageId: string;
  word: string;
  translation: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "pronoun" | "preposition" | "conjunction" | "phrase";
  gender?: "masculine" | "feminine" | "neuter" | null;
  exampleSentence?: string;
  exampleTranslation?: string;
  audioUrl?: string;
}

export interface Phrase {
  id: string;
  languageId: string;
  text: string;
  translation: string;
  context?: string; // Context, e.g., "Greetings", "At a restaurant"
}

export interface Unit {
  id: string; // E.g., "es-unit-1"
  languageId: string;
  title: string;
  description: string;
  lessonIds: string[]; // Ordered list of lesson IDs belonging to this unit
  order: number;
}

export interface Lesson {
  id: string; // E.g., "es-u1-l1"
  unitId: string;
  title: string;
  description: string;
  order: number;
  xp: number;
  goals: string[]; // E.g., ["Greet people", "Introduce yourself"]
  vocabularyIds: string[]; // References to vocabulary introduced in this lesson
  phraseIds: string[]; // References to phrases introduced in this lesson
  activities: Activity[];
}
