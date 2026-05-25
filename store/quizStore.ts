import { create } from "zustand";
import { QuizSession } from "../data/quizzes";

interface QuizState {
  activeQuiz: QuizSession | null;
  currentQuestionIndex: number;
  score: number;
  isFinished: boolean;
  startQuiz: (quiz: QuizSession) => void;
  nextQuestion: () => void;
  incrementScore: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  activeQuiz: null,
  currentQuestionIndex: 0,
  score: 0,
  isFinished: false,
  startQuiz: (quiz) => set({
    activeQuiz: quiz,
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false
  }),
  nextQuestion: () => set((state) => {
    if (!state.activeQuiz) return {};
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex >= state.activeQuiz.questions.length) {
      return { isFinished: true };
    }
    return { currentQuestionIndex: nextIndex };
  }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  finishQuiz: () => set({ isFinished: true }),
  resetQuiz: () => set({
    activeQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false
  }),
}));
