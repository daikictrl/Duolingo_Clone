import React from "react";
import { FlatList, ViewToken, View } from "react-native";
import { Flashcard } from "@/data/flashcardLessons";
import { FlashcardCard } from "./FlashcardCard";

interface FlashcardListProps {
  cards: Flashcard[];
  revealedCards: Record<number, boolean>;
  cardHeight: number;
  width: number;
  flatListRef: React.Ref<FlatList<Flashcard>>;
  onViewableItemsChanged: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void;
  viewabilityConfig: any;
  onReveal: (index: number) => void;
  onPlayAudio: (text: string) => void;
  onPractice: (card: Flashcard) => void;
}

export function FlashcardList({
  cards,
  revealedCards,
  cardHeight,
  width,
  flatListRef,
  onViewableItemsChanged,
  viewabilityConfig,
  onReveal,
  onPlayAudio,
  onPractice,
}: FlashcardListProps) {
  return (
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
        renderItem={({ item, index }) => (
          <FlashcardCard
            item={item}
            index={index}
            totalCards={cards.length}
            isRevealed={revealedCards[index] || false}
            cardHeight={cardHeight}
            width={width}
            onReveal={onReveal}
            onPlayAudio={onPlayAudio}
            onPractice={onPractice}
          />
        )}
      />
    </View>
  );
}
