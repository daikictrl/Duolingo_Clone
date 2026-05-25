import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Flashcard } from "@/data/flashcardLessons";
import { usePronunciationStore } from "@/store/pronunciationStore";

export function usePractice(
  activeLessonLanguage: string,
  onScoreUpdated: (score: number) => void
) {
  const {
    isRecording,
    isEvaluating,
    evaluationResult,
    error: speechError,
    startRecording,
    stopRecording,
    evaluateAudio,
    playTargetSpeech,
    resetSpeechState,
  } = usePronunciationStore();

  const [activePracticeCard, setActivePracticeCard] = useState<Flashcard | null>(null);

  const handlePlayAudio = (text: string) => {
    playTargetSpeech(text, activeLessonLanguage);
  };

  const handleLaunchPractice = (card: Flashcard) => {
    resetSpeechState();
    setActivePracticeCard(card);
  };

  const handleClosePractice = () => {
    resetSpeechState();
    setActivePracticeCard(null);
  };

  const handleToggleRecording = async () => {
    if (!activePracticeCard) return;

    if (!isRecording) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await startRecording();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const uri = await stopRecording();
      if (uri) {
        try {
          const result = await evaluateAudio(activePracticeCard.text, activeLessonLanguage);
          if (result && typeof result.score === "number") {
            onScoreUpdated(result.score);
          }
        } catch (error) {
          console.error("Audio evaluation failed:", error);
          // The error state is already handled by usePronunciationStore and shown in UI
        }
      }
    }
  };

  return {
    activePracticeCard,
    isRecording,
    isEvaluating,
    evaluationResult,
    speechError,
    handlePlayAudio,
    handleLaunchPractice,
    handleClosePractice,
    handleToggleRecording,
  };
}
