import React from "react";
import { View, Text, Pressable } from "@/components/tw";
import { Ionicons } from "@expo/vector-icons";
import { Flashcard } from "@/data/flashcardLessons";
import { COLORS } from "@/theme/colors";

interface FlashcardCardProps {
  item: Flashcard;
  index: number;
  totalCards: number;
  isRevealed: boolean;
  cardHeight: number;
  width: number;
  onReveal: (index: number) => void;
  onPlayAudio: (text: string) => void;
  onPractice: (card: Flashcard) => void;
}

export function FlashcardCard({
  item,
  index,
  totalCards,
  isRevealed,
  cardHeight,
  width,
  onReveal,
  onPlayAudio,
  onPractice,
}: FlashcardCardProps) {
  return (
    <View
      style={{ height: cardHeight, width: width }}
      className="justify-center items-center px-6"
    >
      <Pressable
        onPress={() => onReveal(index)}
        className="w-full h-[85%] bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden justify-center items-center p-6"
        style={{
          borderBottomWidth: 5,
          borderBottomColor: "#E2E8F0",
        }}
      >
        <View className="absolute top-6 left-6 right-6 flex-row justify-between items-center">
          <Text className="text-body-sm font-black text-primary uppercase tracking-widest">
            {item.type}
          </Text>
          <Text className="text-body-sm font-bold text-slate-400">
            {index + 1} of {totalCards}
          </Text>
        </View>

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

        {isRevealed ? (
          <View className="items-center justify-center w-full mt-6 px-4 pt-5 pb-20 bg-slate-50 rounded-2xl border border-slate-100">
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

        <View className="absolute bottom-6 flex-row gap-6">
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onPlayAudio(item.text);
            }}
            className="w-14 h-14 rounded-full bg-primary/10 justify-center items-center active:bg-primary/20 border border-primary/20 shadow-sm"
          >
            <Ionicons name="volume-high" size={26} color={COLORS.primary} />
          </Pressable>

          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onPractice(item);
            }}
            className="w-14 h-14 rounded-full bg-error/10 justify-center items-center active:bg-error/20 border border-error/20 shadow-sm"
          >
            <Ionicons name="mic" size={26} color={COLORS.error} />
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}
