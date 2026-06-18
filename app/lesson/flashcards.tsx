import React, { useCallback } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "@/components/tw";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button3D } from "@/components/Button3D";

import { useFlashcardLesson } from "@/hooks/useFlashcardLesson";
import { usePractice } from "@/hooks/usePractice";

import { ProgressHeader } from "@/components/flashcards/ProgressHeader";
import { CompletionView } from "@/components/flashcards/CompletionView";
import { FlashcardList } from "@/components/flashcards/FlashcardList";
import { PracticeModal } from "@/components/flashcards/PracticeModal";

export default function FlashcardScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { width, height } = useWindowDimensions();

  const {
    lesson,
    activeLesson,
    currentIndex,
    revealedCards,
    showCompletion,
    finalXp,
    flatListRef,
    onViewableItemsChanged,
    viewabilityConfig,
    setCardScores,
    handleReveal,
    handleNextAction,
  } = useFlashcardLesson(lessonId);

  const handleScoreUpdated = useCallback((score: number) => {
    setCardScores((prev) => ({
      ...prev,
      [currentIndex]: Math.max(prev[currentIndex] || 0, score),
    }));
  }, [currentIndex, setCardScores]);

  const {
    activePracticeCard,
    isRecording,
    isEvaluating,
    evaluationResult,
    speechError,
    handlePlayAudio,
    handleLaunchPractice,
    handleClosePractice,
    handleToggleRecording,
  } = usePractice(activeLesson?.language || "", handleScoreUpdated);

  if (!lesson || !activeLesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-h3 font-extrabold text-slate-800 text-center mb-4">Lesson not found</Text>
          <Button3D onPress={() => router.back()}>Go Back</Button3D>
        </View>
      </SafeAreaView>
    );
  }

  const cards = activeLesson.cards;
  const progressPercent = (currentIndex / cards.length) * 100;
  const isCurrentRevealed = revealedCards[currentIndex];

  if (showCompletion) {
    return (
      <CompletionView
        finalXp={finalXp}
        totalCards={cards.length}
        lessonTitle={activeLesson.title}
        onContinue={() => router.replace("/(tabs)/learn")}
      />
    );
  }

  const cardHeight = height - 190; // Fit between header and footer

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProgressHeader
        progressPercent={progressPercent}
        xpReward={activeLesson.xpReward}
        onClose={() => router.back()}
      />

      <FlashcardList
        cards={cards}
        revealedCards={revealedCards}
        cardHeight={cardHeight}
        width={width}
        flatListRef={flatListRef}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onReveal={handleReveal}
        onPlayAudio={handlePlayAudio}
        onPractice={handleLaunchPractice}
      />

      <View className="px-6 py-6 border-t border-slate-100 bg-white shadow-lg">
        <Button3D
          variant={isCurrentRevealed ? "primary" : "outline"}
          size="lg"
          onPress={() => handleNextAction(handlePlayAudio)}
        >
          {!isCurrentRevealed
            ? "REVEAL TRANSLATION"
            : currentIndex < cards.length - 1
            ? "GOT IT • NEXT"
            : "COMPLETE LESSON"}
        </Button3D>
      </View>

      <PracticeModal
        activePracticeCard={activePracticeCard}
        isRecording={isRecording}
        isEvaluating={isEvaluating}
        evaluationResult={evaluationResult}
        speechError={speechError}
        onClose={handleClosePractice}
        onToggleRecording={handleToggleRecording}
        onPlayAudio={handlePlayAudio}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
});
