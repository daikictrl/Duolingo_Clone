import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ProgressState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  xp: number;
  streak: number;
  completedLessonIds: string[]; // for compatibility with legacy lessons
  completedFlashcardLessonIds: string[]; // completed flashcard lesson IDs
  completedQuizIds: string[]; // completed quiz session IDs
  
  addXp: (amount: number) => void;
  setStreak: (count: number) => void;
  completeLesson: (lessonId: string, xpReward?: number) => void;
  toggleLessonCompletion: (lessonId: string, xpReward?: number) => void;
  completeFlashcardLesson: (lessonId: string, xpReward?: number) => void;
  completeQuiz: (quizId: string, xpReward?: number) => void;
  resetProgress: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      selectedLanguageId: "es", // Default language (Spanish)
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      xp: 0,
      streak: 0,
      completedLessonIds: [],
      completedFlashcardLessonIds: [],
      completedQuizIds: [],
      
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      setStreak: (count) => set({ streak: count }),
      
      completeLesson: (lessonId, xpReward = 10) => set((state) => {
        if (state.completedLessonIds.includes(lessonId)) {
          return {};
        }
        return {
          completedLessonIds: [...state.completedLessonIds, lessonId],
          xp: state.xp + xpReward
        };
      }),
      
      toggleLessonCompletion: (lessonId, xpReward = 10) => set((state) => {
        const isCompleted = state.completedLessonIds.includes(lessonId);
        if (isCompleted) {
          return {
            completedLessonIds: state.completedLessonIds.filter((id) => id !== lessonId),
            xp: Math.max(0, state.xp - xpReward),
          };
        }
        return {
          completedLessonIds: [...state.completedLessonIds, lessonId],
          xp: state.xp + xpReward
        };
      }),

      completeFlashcardLesson: (lessonId, xpReward = 15) => set((state) => {
        if (state.completedFlashcardLessonIds.includes(lessonId)) {
          return {};
        }
        return {
          completedFlashcardLessonIds: [...state.completedFlashcardLessonIds, lessonId],
          xp: state.xp + xpReward
        };
      }),

      completeQuiz: (quizId, xpReward = 15) => set((state) => {
        if (state.completedQuizIds.includes(quizId)) {
          return {};
        }
        return {
          completedQuizIds: [...state.completedQuizIds, quizId],
          xp: state.xp + xpReward
        };
      }),
      
      resetProgress: () => set({
        selectedLanguageId: "es",
        xp: 0,
        streak: 0,
        completedLessonIds: [],
        completedFlashcardLessonIds: [],
        completedQuizIds: [],
      }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "progress-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
        xp: state.xp,
        streak: state.streak,
        completedLessonIds: state.completedLessonIds,
        completedFlashcardLessonIds: state.completedFlashcardLessonIds,
        completedQuizIds: state.completedQuizIds,
      }),
      onRehydrateStorage: (state) => {
        return () => {
          state.setHasHydrated(true);
        };
      },
    }
  )
);
