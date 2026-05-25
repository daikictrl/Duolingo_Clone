import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, useWindowDimensions, FlatList, ViewToken, Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getFlashcardLessonById, Flashcard } from "@/data/flashcardLessons";
import { useLessonStore } from "@/store/lessonStore";
import { useLearningStore } from "@/store/learningStore";
import { usePronunciationStore } from "@/store/pronunciationStore";
import { Button3D } from "@/components/Button3D";
import { Image } from "@/components/tw/image";
import { images } from "@/constants/images";
import { COLORS } from "@/theme/colors";
import * as Haptics from "expo-haptics";

export default function FlashcardScreen() {
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const { width, height } = useWindowDimensions();

  const lesson = lessonId ? getFlashcardLessonById(lessonId) : null;
  const { completeFlashcardLesson } = useLearningStore();
  const { activeLesson, currentIndex, startLesson, nextCard, resetLesson } = useLessonStore();
  
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

  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [activePracticeCard, setActivePracticeCard] = useState<Flashcard | null>(null);
  const [cardScores, setCardScores] = useState<Record<number, number>>({});
  const [finalXp, setFinalXp] = useState(0);

  const flatListRef = useRef<FlatList<Flashcard>>(null);

  useEffect(() => {
    if (lesson) {
      startLesson(lesson);
      setRevealedCards({});
      setShowCompletion(false);
      setCardScores({});
      setFinalXp(0);
    }
    return () => {
      resetLesson();
    };
  }, [lessonId, lesson, startLesson, resetLesson]);

  // Synchronize store index if the user swipes manually
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      const index = viewableItems[0].index;
      useLessonStore.setState({ currentIndex: index });
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

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
  const currentCard = cards[currentIndex];

  const handleReveal = (index: number) => {
    setRevealedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handlePlayAudio = (text: string) => {
    playTargetSpeech(text, activeLesson.language);
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
        const result = await evaluateAudio(activePracticeCard.text, activeLesson.language);
        if (result && typeof result.score === "number") {
          setCardScores((prev) => ({
            ...prev,
            [currentIndex]: Math.max(prev[currentIndex] || 0, result.score),
          }));
        }
      }
    }
  };

  const handleNextAction = () => {
    const isCurrentRevealed = revealedCards[currentIndex];

    if (!isCurrentRevealed) {
      // Step 1: Reveal translation/example
      handleReveal(currentIndex);
      // Automatically play sound when revealed
      handlePlayAudio(currentCard.text);
    } else {
      // Step 2: Go to next card or finish
      if (currentIndex < cards.length - 1) {
        nextCard();
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        // Calculate earned XP based on pronunciation scores across ALL cards
        let totalScore = 0;
        cards.forEach((_, idx) => {
          if (cardScores[idx] !== undefined) {
            totalScore += cardScores[idx];
          }
        });

        // The average score is out of the TOTAL cards, so skipped cards count as 0%
        const averageScore = totalScore / cards.length;
        const earnedXp = Math.max(0, Math.floor(activeLesson.xpReward * (averageScore / 100)));

        setFinalXp(earnedXp);

        // Complete the lesson!
        completeFlashcardLesson(activeLesson.id, earnedXp, averageScore);
        setShowCompletion(true);
      }
    }
  };

  if (showCompletion) {
    let mascotSource = images.mascotWelcome;
    if (finalXp < 10) {
      mascotSource = images.mascotSadCompletely;
    } else if (finalXp < 15) {
      mascotSource = images.mascotSadLittle;
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 justify-center items-center px-6 py-12 bg-white">
          <Image
            source={mascotSource}
            className="w-48 h-48 mb-8"
            style={{ objectFit: "contain" }}
          />
          <Text className="text-[28px] font-extrabold text-slate-800 text-center mb-2">
            Lesson Completed!
          </Text>
          <Text className="text-body-lg text-slate-500 text-center mb-8 px-4">
            You successfully learned all flashcards in {activeLesson.title}!
          </Text>

          <View className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-row justify-around mb-12">
            <View className="items-center">
              <Text className="text-body-sm font-bold text-slate-400 uppercase">Reward</Text>
              <Text className="text-h3 font-extrabold text-amber-500">+{finalXp} XP</Text>
            </View>
            <View className="items-center">
              <Text className="text-body-sm font-bold text-slate-400 uppercase">Cards</Text>
              <Text className="text-h3 font-extrabold text-primary">{cards.length} Learned</Text>
            </View>
          </View>

          <Button3D variant="success" size="lg" onPress={() => router.replace("/(tabs)/learn")}>
            CONTINUE
          </Button3D>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate card layout sizes dynamically
  const cardHeight = height - 190; // Fit between header and footer

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-slate-200 justify-center items-center active:bg-slate-100"
        >
          <Ionicons name="close" size={20} color="#64748B" />
        </Pressable>

        {/* Dynamic 3D progress bar */}
        <View className="flex-1 mx-4 h-[16px] bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative justify-center">
          <View
            style={{ width: `${progressPercent}%` }}
            className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
          />
          {/* Subtle highlight effect to give the progress bar a 3D feeling */}
          <View
            style={{ width: `${progressPercent}%` }}
            className="absolute left-0 top-0 h-[6px] bg-white/20 rounded-full"
          />
        </View>

        <View className="flex-row items-center">
          <Ionicons name="flash" size={18} color="#F59E0B" />
          <Text className="text-[14px] font-extrabold text-amber-500 ml-1">
            +{activeLesson.xpReward} XP
          </Text>
        </View>
      </View>

      {/* Main Flashcard Snapping List */}
      <View className="flex-1 bg-slate-50">
        <FlatList
          ref={flatListRef}
          data={cards}
          keyExtractor={(_, index) => index.toString()}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={cardHeight}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item, index }) => {
            const isRevealed = revealedCards[index];

            return (
              <View
                style={{ height: cardHeight, width: width }}
                className="justify-center items-center px-6"
              >
                {/* 3D-styled card */}
                <Pressable
                  onPress={() => handleReveal(index)}
                  className={`w-full h-[85%] bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden justify-center items-center p-6`}
                  style={{
                    borderBottomWidth: 5,
                    borderBottomColor: "#E2E8F0",
                  }}
                >
                  {/* Card category tags */}
                  <View className="absolute top-6 left-6 right-6 flex-row justify-between items-center">
                    <Text className="text-body-sm font-black text-primary uppercase tracking-widest">
                      {item.type}
                    </Text>
                    <Text className="text-body-sm font-bold text-slate-400">
                      {index + 1} of {cards.length}
                    </Text>
                  </View>

                  {/* Main Word / Phrase */}
                  <View className="items-center justify-center my-4 px-2">
                    <Text className="text-[36px] font-bold text-slate-800 text-center tracking-tight">
                      {item.text}
                    </Text>
                    {item.pronunciation && (
                      <Text className="text-body-lg text-slate-400 font-bold mt-2 italic text-center">
                        {"\"" + item.pronunciation + "\""}
                      </Text>
                    )}
                  </View>

                  {/* Revealed Section */}
                  {isRevealed ? (
                    <View className="items-center justify-center w-full mt-6 px-4 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Text className="text-[20px] font-bold text-slate-700 text-center mb-1">
                        {item.translation}
                      </Text>
                      <Text className="text-body-sm text-slate-400 font-bold text-center mt-3 mb-1">
                        Example usage:
                      </Text>
                      <Text className="text-body-md text-primary font-black text-center italic">
                        {item.example}
                      </Text>
                      <Text className="text-body-sm text-slate-500 text-center mt-1">
                        {item.exampleTranslation}
                      </Text>
                    </View>
                  ) : (
                    <View className="mt-8 flex-row items-center bg-primary/10 px-4 py-2.5 rounded-full">
                      <Ionicons name="eye-outline" size={16} color="#007CFF" />
                      <Text className="text-body-sm font-bold text-primary ml-1.5">
                        Tap card to flip
                      </Text>
                    </View>
                  )}

                  {/* Side-by-Side Speaker and Mic Action Buttons */}
                  <View className="absolute bottom-6 flex-row gap-6">
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(item.text);
                      }}
                      className="w-14 h-14 rounded-full bg-primary/10 justify-center items-center active:bg-primary/20 border border-primary/20 shadow-sm"
                    >
                      <Ionicons name="volume-high" size={26} color={COLORS.primary} />
                    </Pressable>

                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleLaunchPractice(item);
                      }}
                      className="w-14 h-14 rounded-full bg-error/10 justify-center items-center active:bg-error/20 border border-error/20 shadow-sm"
                    >
                      <Ionicons name="mic" size={26} color={COLORS.error} />
                    </Pressable>
                  </View>
                </Pressable>
              </View>
            );
          }}
        />
      </View>

      {/* Bottom Pinned Button */}
      <View className="px-6 py-6 border-t border-slate-100 bg-white">
        <Button3D
          variant={revealedCards[currentIndex] ? "primary" : "outline"}
          size="lg"
          onPress={handleNextAction}
        >
          {!revealedCards[currentIndex]
            ? "REVEAL TRANSLATION"
            : currentIndex < cards.length - 1
            ? "GOT IT • NEXT"
            : "COMPLETE LESSON"}
        </Button3D>
      </View>

      {/* Pronunciation Modal */}
      <Modal
        visible={activePracticeCard !== null}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClosePractice}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
            <Pressable
              onPress={handleClosePractice}
              className="w-10 h-10 rounded-full border border-slate-200 justify-center items-center active:bg-slate-100"
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </Pressable>
            <Text className="text-body-lg font-extrabold text-slate-800">
              AI Speech Practice
            </Text>
            <View className="w-10" />
          </View>

          {/* Modal Body */}
          <View className="flex-1 px-6 justify-center items-center">
            <Text className="text-body-sm font-black uppercase tracking-widest text-slate-400 mb-2">
              Practice saying:
            </Text>

            {activePracticeCard && (
              <View className="items-center mb-8 px-4">
                <Text className="text-[34px] font-bold text-slate-800 text-center">
                  {activePracticeCard.text}
                </Text>
                {activePracticeCard.pronunciation && (
                  <Text className="text-body-lg text-slate-400 font-bold mt-2 italic text-center">
                    {"\"" + activePracticeCard.pronunciation + "\""}
                  </Text>
                )}

                {/* Speaker icon helper inside modal */}
                <Pressable
                  onPress={() => handlePlayAudio(activePracticeCard.text)}
                  className="mt-4 flex-row items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-full active:bg-primary/20 border border-primary/20"
                >
                  <Ionicons name="volume-high" size={18} color={COLORS.primary} />
                  <Text className="text-body-sm font-extrabold text-primary">Listen to Audio</Text>
                </Pressable>
              </View>
            )}

            {/* Evaluation Results Area */}
            <View className="w-full min-h-[160px] justify-center items-center mb-10">
              {isEvaluating ? (
                <View key="evaluating" className="items-center">
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text className="text-body-md font-bold text-slate-500 mt-4">
                    AI is grading your accent...
                  </Text>
                </View>
              ) : evaluationResult ? (
                <View key="result" className="w-full bg-slate-50 rounded-3xl p-6 border border-slate-100 items-center">
                  {/* Score Indicator */}
                  <View className="flex-row items-center gap-2 mb-3">
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                        evaluationResult.score >= 70
                          ? "bg-success/15 border-success"
                          : "bg-error/15 border-error"
                      }`}
                    >
                      <Text
                        className={`text-body-lg font-black ${
                          evaluationResult.score >= 70 ? "text-success" : "text-error"
                        }`}
                      >
                        {evaluationResult.score}
                      </Text>
                    </View>
                    <Text className="text-body-md font-black text-slate-700">
                      Accent Score
                    </Text>
                  </View>

                  <Text className="text-body-sm text-slate-400 font-bold mb-1">What we heard:</Text>
                  <Text className="text-body-md text-slate-800 font-extrabold text-center italic mb-4">
                    {"\"" + (evaluationResult.transcription || "...") + "\""}
                  </Text>

                  <Text className="text-body-sm font-semibold text-slate-600 text-center px-2">
                    {evaluationResult.feedback}
                  </Text>
                </View>
              ) : speechError ? (
                <View key="error" className="w-full bg-error/10 rounded-2xl p-5 border border-error/20 items-center">
                  <Ionicons name="alert-circle" size={24} color={COLORS.error} />
                  <Text className="text-body-sm font-bold text-error text-center mt-2">
                    {speechError}
                  </Text>
                </View>
              ) : (
                <Text key="idle" className="text-body-md text-slate-400 font-bold text-center px-8">
                  {isRecording ? "Listening... Tap the red button to finish and evaluate." : "Tap the red microphone button below, then speak clearly into your device."}
                </Text>
              )}
            </View>

            {/* Pulse Voice Visualizer Mock (only visible while recording) */}
            {isRecording && (
              <View className="flex-row gap-1 justify-center items-center h-8 mb-6">
                {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((scale, i) => (
                  <View
                    key={i}
                    style={{ height: scale * 4 }}
                    className="w-1.5 bg-error rounded-full"
                  />
                ))}
              </View>
            )}

            <Pressable
              onPress={handleToggleRecording}
              disabled={isEvaluating}
              className={`w-24 h-24 rounded-full justify-center items-center border-4 ${
                isRecording
                  ? "bg-error/25 border-error/50 active:bg-error/35"
                  : "bg-error border-error-dark/20 active:bg-red-600"
              } shadow-lg`}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={40}
                color={isRecording ? COLORS.error : "white"}
              />
            </Pressable>
            <Text className="text-body-sm font-black text-slate-500 uppercase tracking-widest mt-4">
              {isRecording ? "TAP TO STOP" : "TAP TO RECORD"}
            </Text>
          </View>

          {/* Modal Footer */}
          <View className="px-6 py-6 border-t border-slate-100 bg-white">
            {evaluationResult ? (
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Button3D variant="outline" size="lg" onPress={handleToggleRecording}>
                    TRY AGAIN
                  </Button3D>
                </View>
                <View className="flex-1">
                  <Button3D variant="success" size="lg" onPress={handleClosePractice}>
                    GOT IT
                  </Button3D>
                </View>
              </View>
            ) : (
              <Button3D variant="outline" size="lg" onPress={handleClosePractice}>
                CANCEL
              </Button3D>
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
