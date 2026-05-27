import React, { useEffect } from "react";
import { StyleSheet, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { useLearningStore } from "@/store/learningStore";
import { getLanguageById } from "@/data/languages";
import { getUnitsByLanguage } from "@/data/units";
import { getLessonsByUnit } from "@/data/lessons";
import { useActiveLesson } from "@/hooks/useActiveLesson";
import { images } from "@/constants/images";
import { COLORS } from "@/theme/colors";
import { usePostHog } from "posthog-react-native";
import GroupFiveAnimation from "@/components/GroupFiveAnimation";

export default function HomeTab() {
  const router = useRouter();
  const { user } = useUser();
  const firstName = user?.firstName || "Friend";
  const posthog = usePostHog();

  const { selectedLanguageId, xp, streak, checkStreakReset } = useLearningStore();

  // Reset streak if the user missed a day (runs each time the home screen mounts)
  useEffect(() => {
    checkStreakReset();
  }, []);

  const currentLanguage = selectedLanguageId ? getLanguageById(selectedLanguageId) : null;

  // Determine active unit and active lesson based on completed lessons
  const { activeUnit, activeLesson } = useActiveLesson(
    getUnitsByLanguage,
    getLessonsByUnit
  );

  // Get dynamic greeting based on selected language
  const getGreeting = (langId: string | null) => {
    switch (langId) {
      case "es":
        return "¡Hola";
      case "fr":
        return "Bonjour";
      case "ja":
        return "こんにちは";
      default:
        return "Hello";
    }
  };

  const greeting = `${getGreeting(selectedLanguageId)}, ${firstName}! 👋`;

  // Daily goal calculation: Daily goal is 20 XP. Today's progress is (xp % 20) or xp up to 20 if we want to show single day progress.
  // For a realistic feel, let's treat the daily progress as the current xp up to 20, capped.
  const dailyGoalXp = 20;
  const progressXp = Math.min(xp, dailyGoalXp);
  const progressPercentage = (progressXp / dailyGoalXp) * 100;


  const handleContinueLearning = () => {
    posthog.capture("continue_learning_tapped", {
      language_id: selectedLanguageId,
      unit_title: activeUnit?.title ?? null,
    });
    router.push("/learn");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header section */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-gray bg-white">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          {/* Flag image */}
          {currentLanguage?.flag ? (
            <Pressable
              onPress={() => router.push("/language-selection")}
              className="w-10 h-10 rounded-full overflow-hidden border border-border-gray bg-surface justify-center items-center active:opacity-85"
            >
              <Image
                source={currentLanguage.flag}
                className="w-10 h-10 rounded-full"
                style={{ objectFit: "cover" }}
              />
            </Pressable>
          ) : (
            <View className="w-10 h-10 rounded-full bg-surface border border-border-gray" />
          )}

          {/* Greeting text */}
          <Text
            className="text-h4 text-text-primary font-bold flex-1"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {greeting}
          </Text>
        </View>

        {/* Right side stats & alerts */}
        <View className="flex-row items-center gap-2">
          {/* Streak pill */}
          <View className="flex-row items-center bg-surface border border-border-gray px-3 py-1.5 rounded-full gap-1.5">
            <Image
              source={images.streakFire}
              className="w-5 h-5"
              style={{ objectFit: "contain" }}
            />
            <Text className="text-body-md text-text-primary font-bold">
              {streak}
            </Text>
          </View>

          {/* User Avatar */}
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-10 h-10 rounded-full border border-border-gray"
            />
          ) : (
            <Pressable
              className="w-10 h-10 rounded-full bg-surface border border-border-gray justify-center items-center active:bg-gray-100"
              accessibilityLabel="Profile"
              accessibilityRole="button"
            >
              <Ionicons name="person-outline" size={20} color={COLORS.textPrimary} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Main content body */}
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Goal Card */}
        <View className="mx-6 mt-6 p-5 card-3d bg-[#FAF5F0] flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-caption text-text-secondary uppercase font-bold tracking-widest mb-1">
              Daily goal
            </Text>
            <Text className="text-h3 text-text-primary font-bold">
              {progressXp} <Text className="text-body-md text-text-secondary font-medium">/ {dailyGoalXp} XP</Text>
            </Text>

            {/* 3D Progress Bar */}
            <View className="progress-3d-track mt-3 bg-gray-200">
              <View
                style={[styles.progressFill, { width: `${progressPercentage}%` }]}
                className="progress-3d-fill bg-streak"
              >
                <View className="progress-3d-gloss" />
              </View>
            </View>
          </View>

          {/* Treasure chest graphic */}
          <Image
            source={images.treasure}
            className="w-16 h-16"
            style={{ objectFit: "contain" }}
          />
        </View>

        {/* Continue Learning Card */}
        <Pressable
          onPress={handleContinueLearning}
          className="mx-6 mt-6 p-4 rounded-2xl bg-primary border-2 border-primary-dark border-b-[5px] flex-row items-center justify-between"
          testID="continue-learning-card"
        >
          <View className="flex-1 pr-3">
            <Text className="text-caption text-white/70 uppercase font-bold tracking-widest mb-0.5">
              {currentLanguage?.name || "Learning"}
            </Text>
            <Text className="text-body-lg text-white font-bold mb-1 leading-snug">
              {activeUnit?.title || "Unit 1"}
            </Text>
            <Text className="text-body-sm text-white/80 leading-relaxed mb-3" numberOfLines={1}>
              {activeUnit?.description || "Master new vocabulary and speak confidently."}
            </Text>

            {/* White 3D styled button inside the card */}
            <Pressable
              onPress={handleContinueLearning}
              style={styles.continueButton}
              className="bg-white px-5 py-2 rounded-xl border border-transparent border-b-4 border-b-gray-300 self-start active:translate-y-0.5 active:border-b-2"
            >
              <Text className="text-primary font-bold text-body-md">Continue</Text>
            </Pressable>
          </View>

          {/* Castle/Palace graphic */}
          <Image
            source={images.palace}
            className="w-20 h-20 ml-2"
            style={{ objectFit: "contain" }}
          />
        </Pressable>

        {/* Group 5 Team Animation */}
        <GroupFiveAnimation />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
  },
  continueButton: {
    ...Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
