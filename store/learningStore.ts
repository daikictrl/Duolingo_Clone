import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LearningState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  xp: number;
  streak: number;
  completedLessonIds: string[];
  completedFlashcardLessonIds: string[];
  completedQuizIds: string[];
  flashcardScores: Record<string, number>;
  quizScores: Record<string, number>;
  
  addXp: (amount: number) => void;
  setStreak: (count: number) => void;
  completeLesson: (lessonId: string, xpReward?: number) => void;
  toggleLessonCompletion: (lessonId: string, xpReward?: number) => void;
  completeFlashcardLesson: (lessonId: string, xpReward?: number, scorePercentage?: number) => void;
  completeQuiz: (quizId: string, xpReward?: number, scorePercentage?: number) => void;
  resetProgress: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      selectedLanguageId: "es", // Default language to Spanish
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      xp: 0,
      streak: 0,
      completedLessonIds: [],
      completedFlashcardLessonIds: [],
      completedQuizIds: [],
      flashcardScores: {},
      quizScores: {},
      
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

      completeFlashcardLesson: (lessonId, xpReward = 15, scorePercentage = 100) => set((state) => {
        const isAlreadyCompleted = state.completedFlashcardLessonIds.includes(lessonId);
        const existingScore = state.flashcardScores[lessonId] || 0;
        
        // If they already completed it with a better score, don't update score negatively
        const newScore = Math.max(existingScore, scorePercentage);

        return {
          completedFlashcardLessonIds: isAlreadyCompleted ? state.completedFlashcardLessonIds : [...state.completedFlashcardLessonIds, lessonId],
          flashcardScores: { ...state.flashcardScores, [lessonId]: newScore },
          xp: state.xp + (isAlreadyCompleted ? 0 : xpReward)
        };
      }),

      completeQuiz: (quizId, xpReward = 15, scorePercentage = 100) => set((state) => {
        const isAlreadyCompleted = state.completedQuizIds.includes(quizId);
        const existingScore = state.quizScores[quizId] || 0;
        
        const newScore = Math.max(existingScore, scorePercentage);

        return {
          completedQuizIds: isAlreadyCompleted ? state.completedQuizIds : [...state.completedQuizIds, quizId],
          quizScores: { ...state.quizScores, [quizId]: newScore },
          xp: state.xp + (isAlreadyCompleted ? 0 : xpReward)
        };
      }),
      
      resetProgress: () => set({
        selectedLanguageId: "es",
        xp: 0,
        streak: 0,
        completedLessonIds: [],
        completedFlashcardLessonIds: [],
        completedQuizIds: [],
        flashcardScores: {},
        quizScores: {},
      }),

      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "learning-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
        xp: state.xp,
        streak: state.streak,
        completedLessonIds: state.completedLessonIds,
        completedFlashcardLessonIds: state.completedFlashcardLessonIds,
        completedQuizIds: state.completedQuizIds,
        flashcardScores: state.flashcardScores,
        quizScores: state.quizScores,
      }),
      onRehydrateStorage: (state) => {
        return () => {
          state.setHasHydrated(true);
        };
      },
    }
  )
);
