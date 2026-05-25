import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { View, Text } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Button3D } from "@/components/Button3D";
import { images } from "@/constants/images";

interface CompletionViewProps {
  finalXp: number;
  totalCards: number;
  lessonTitle: string;
  onContinue: () => void;
}

export function CompletionView({
  finalXp,
  totalCards,
  lessonTitle,
  onContinue,
}: CompletionViewProps) {
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
          You successfully learned all flashcards in {lessonTitle}!
        </Text>

        <View className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-row justify-around mb-12">
          <View className="items-center">
            <Text className="text-body-sm font-bold text-slate-400 uppercase">Reward</Text>
            <Text className="text-h3 font-extrabold text-amber-500">+{finalXp} XP</Text>
          </View>
          <View className="items-center">
            <Text className="text-body-sm font-bold text-slate-400 uppercase">Cards</Text>
            <Text className="text-h3 font-extrabold text-primary">{totalCards} Learned</Text>
          </View>
        </View>

        <Button3D variant="success" size="lg" onPress={onContinue}>
          CONTINUE
        </Button3D>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
