import { create } from "zustand";
import { FlashcardLesson } from "../data/flashcardLessons";

interface LessonState {
  activeLesson: FlashcardLesson | null;
  currentIndex: number;
  startLesson: (lesson: FlashcardLesson) => void;
  nextCard: () => void;
  prevCard: () => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  activeLesson: null,
  currentIndex: 0,
  startLesson: (lesson) => set({ activeLesson: lesson, currentIndex: 0 }),
  nextCard: () => set((state) => {
    if (!state.activeLesson) return {};
    const maxIndex = state.activeLesson.cards.length - 1;
    return { currentIndex: Math.min(maxIndex, state.currentIndex + 1) };
  }),
  prevCard: () => set((state) => ({
    currentIndex: Math.max(0, state.currentIndex - 1)
  })),
  resetLesson: () => set({ activeLesson: null, currentIndex: 0 }),
}));
