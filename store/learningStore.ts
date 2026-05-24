import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LearningState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
  xp: number;
  streak: number;
  completedLessonIds: string[];
  addXp: (amount: number) => void;
  setStreak: (count: number) => void;
  completeLesson: (lessonId: string, xpReward?: number) => void;
  resetProgress: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
      xp: 15, // Default for onboarding / matching mock
      streak: 3, // Default streak count matching mock
      completedLessonIds: [],
      
      addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
      setStreak: (count) => set({ streak: count }),
      completeLesson: (lessonId, xpReward = 10) => set((state) => {
        if (state.completedLessonIds.includes(lessonId)) {
          return {}; // already completed
        }
        return {
          completedLessonIds: [...state.completedLessonIds, lessonId],
          xp: state.xp + xpReward
        };
      }),
      resetProgress: () => set({
        selectedLanguageId: null,
        xp: 15,
        streak: 3,
        completedLessonIds: [],
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
      }),
      onRehydrateStorage: (state) => {
        return () => {
          state.setHasHydrated(true);
        };
      },
    }
  )
);

