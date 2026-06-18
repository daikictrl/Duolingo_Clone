import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------------------------------------------------------------------
// Helper: compute the new streak given the stored lastPracticeDate
// ---------------------------------------------------------------------------
function computeStreak(currentStreak: number, lastPracticeDate: string | null): {
  newStreak: number;
  newLastPracticeDate: string;
} {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // "YYYY-MM-DD"

  if (!lastPracticeDate) {
    // First time ever practicing
    return { newStreak: 1, newLastPracticeDate: todayStr };
  }

  if (lastPracticeDate === todayStr) {
    // Already practiced today — don't double-count
    return { newStreak: currentStreak, newLastPracticeDate: todayStr };
  }

  // Calculate how many days since last practice
  const last = new Date(lastPracticeDate);
  const diffMs = today.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0);
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Practiced yesterday → keep the chain going
    return { newStreak: currentStreak + 1, newLastPracticeDate: todayStr };
  }

  // Missed one or more days → chain broken, start fresh
  return { newStreak: 1, newLastPracticeDate: todayStr };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export interface LearningState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  xp: number;
  streak: number;
  lastPracticeDate: string | null; // "YYYY-MM-DD"

  completedFlashcardLessonIds: string[];
  completedQuizIds: string[];
  flashcardScores: Record<string, number>;
  quizScores: Record<string, number>;

  addXp: (amount: number) => void;
  /** Call on app startup to reset streak if user missed a day */
  checkStreakReset: () => void;

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
      lastPracticeDate: null,

      completedFlashcardLessonIds: [],
      completedQuizIds: [],
      flashcardScores: {},
      quizScores: {},

      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

      // Check on app startup whether the user missed a day and reset streak
      checkStreakReset: () =>
        set((state) => {
          if (!state.lastPracticeDate || state.streak === 0) return {};

          const today = new Date();
          const todayStr = today.toISOString().split("T")[0];

          if (state.lastPracticeDate === todayStr) return {}; // practiced today, all good

          const last = new Date(state.lastPracticeDate);
          const diffMs =
            today.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0);
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays > 1) {
            // Missed at least one day — reset streak
            return { streak: 0 };
          }

          return {};
        }),

      completeFlashcardLesson: (lessonId, xpReward = 15, scorePercentage = 100) =>
        set((state) => {
          const isAlreadyCompleted = state.completedFlashcardLessonIds.includes(lessonId);
          const existingScore = state.flashcardScores[lessonId] || 0;
          const newScore = Math.max(existingScore, scorePercentage);

          // Update streak on every completion attempt (even replays count as daily practice)
          const { newStreak, newLastPracticeDate } = computeStreak(
            state.streak,
            state.lastPracticeDate
          );

          return {
            completedFlashcardLessonIds: isAlreadyCompleted
              ? state.completedFlashcardLessonIds
              : [...state.completedFlashcardLessonIds, lessonId],
            flashcardScores: { ...state.flashcardScores, [lessonId]: newScore },
            xp: state.xp + (isAlreadyCompleted ? 0 : xpReward),
            streak: newStreak,
            lastPracticeDate: newLastPracticeDate,
          };
        }),

      completeQuiz: (quizId, xpReward = 15, scorePercentage = 100) =>
        set((state) => {
          const isAlreadyCompleted = state.completedQuizIds.includes(quizId);
          const existingScore = state.quizScores[quizId] || 0;
          const newScore = Math.max(existingScore, scorePercentage);

          // Update streak on every quiz completion (even replays count as daily practice)
          const { newStreak, newLastPracticeDate } = computeStreak(
            state.streak,
            state.lastPracticeDate
          );

          return {
            completedQuizIds: isAlreadyCompleted
              ? state.completedQuizIds
              : [...state.completedQuizIds, quizId],
            quizScores: { ...state.quizScores, [quizId]: newScore },
            xp: state.xp + (isAlreadyCompleted ? 0 : xpReward),
            streak: newStreak,
            lastPracticeDate: newLastPracticeDate,
          };
        }),

      resetProgress: () =>
        set({
          selectedLanguageId: "es",
          xp: 0,
          streak: 0,
          lastPracticeDate: null,

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
        lastPracticeDate: state.lastPracticeDate,

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
