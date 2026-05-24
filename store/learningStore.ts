import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LearningState {
  selectedLanguageId: string | null;
  setSelectedLanguageId: (id: string | null) => void;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguageId: (id) => set({ selectedLanguageId: id }),
    }),
    {
      name: "learning-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
