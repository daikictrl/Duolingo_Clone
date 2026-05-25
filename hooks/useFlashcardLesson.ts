import { useState, useRef, useEffect } from "react";
import { FlatList, ViewToken } from "react-native";
import { getFlashcardLessonById, Flashcard } from "@/data/flashcardLessons";
import { useLessonStore } from "@/store/lessonStore";
import { useLearningStore } from "@/store/learningStore";

export function useFlashcardLesson(lessonId: string | undefined) {
  const lesson = lessonId ? getFlashcardLessonById(lessonId) : null;
  const { completeFlashcardLesson } = useLearningStore();
  const { activeLesson, currentIndex, startLesson, nextCard, resetLesson } = useLessonStore();

  const [revealedCards, setRevealedCards] = useState<Record<number, boolean>>({});
  const [showCompletion, setShowCompletion] = useState(false);
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

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      const index = viewableItems[0].index;
      useLessonStore.setState({ currentIndex: index });
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleReveal = (index: number) => {
    setRevealedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleNextAction = (onPlayAudio: (text: string) => void) => {
    if (!activeLesson) return;
    
    const cards = activeLesson.cards;
    const isCurrentRevealed = revealedCards[currentIndex];
    const currentCard = cards[currentIndex];

    if (!isCurrentRevealed) {
      handleReveal(currentIndex);
      onPlayAudio(currentCard.text);
    } else {
      if (currentIndex < cards.length - 1) {
        nextCard();
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        let totalScore = 0;
        cards.forEach((_, idx) => {
          if (cardScores[idx] !== undefined) {
            totalScore += cardScores[idx];
          }
        });

        const averageScore = totalScore / cards.length;
        const earnedXp = Math.max(0, Math.floor(activeLesson.xpReward * (averageScore / 100)));

        setFinalXp(earnedXp);
        completeFlashcardLesson(activeLesson.id, earnedXp, averageScore);
        setShowCompletion(true);
      }
    }
  };

  return {
    lesson,
    activeLesson,
    currentIndex,
    revealedCards,
    showCompletion,
    cardScores,
    finalXp,
    flatListRef,
    onViewableItemsChanged,
    viewabilityConfig,
    setCardScores,
    handleReveal,
    handleNextAction,
  };
}
