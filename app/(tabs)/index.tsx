import React from "react";
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

export default function HomeTab() {
  const router = useRouter();
  const { user } = useUser();
  const firstName = user?.firstName || "Friend";

  const {
    selectedLanguageId,
    xp,
    streak,
    addXp,
    toggleLessonCompletion,
    resetProgress,
  } = useLearningStore();

  const currentLanguage = selectedLanguageId ? getLanguageById(selectedLanguageId) : null;

  // Determine active unit and active lesson based on completed lessons
  const { activeUnit, activeLesson, isActiveCompleted } = useActiveLesson(
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

  const handleLessonPress = () => {
    if (activeLesson) {
      toggleLessonCompletion(activeLesson.id, activeLesson.xp);
    }
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

          {/* Notification icon */}
          <Pressable
            className="w-10 h-10 rounded-full bg-surface border border-border-gray justify-center items-center active:bg-gray-100"
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.textPrimary} />
          </Pressable>
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
          onPress={() => router.push("/learn")}
          className="mx-6 mt-6 p-5 rounded-2xl bg-primary border-2 border-primary-dark border-b-[5px] flex-row items-center justify-between"
        >
          <View className="flex-1 pr-3">
            <Text className="text-caption text-white/70 uppercase font-bold tracking-widest mb-1">
              {currentLanguage?.name || "Learning"}
            </Text>
            <Text className="text-h4 text-white font-bold mb-1.5 leading-snug">
              {activeUnit?.title || "Unit 1"}
            </Text>
            <Text className="text-body-sm text-white/80 leading-relaxed mb-4" numberOfLines={2}>
              {activeUnit?.description || "Master new vocabulary and speak confidently."}
            </Text>
            
            {/* White 3D styled button inside the card */}
            <View 
              style={styles.continueButton} 
              className="bg-white px-5 py-2.5 rounded-xl border border-transparent border-b-4 border-b-gray-300 self-start active:translate-y-0.5 active:border-b-2"
            >
              <Text className="text-primary font-bold text-body-md">Continue</Text>
            </View>
          </View>

          {/* Castle/Palace graphic */}
          <Image
            source={images.palace}
            className="w-24 h-24 ml-2"
            style={{ objectFit: "contain" }}
          />
        </Pressable>

        {/* Today's Plan section */}
        <View className="flex-row items-center justify-between mx-6 mt-8 mb-4">
          <Text className="text-h3 text-text-primary font-bold">{"Today's plan"}</Text>
          <Pressable onPress={() => router.push("/learn")}>
            <Text className="text-body-md text-primary font-bold">View all</Text>
          </Pressable>
        </View>

        {/* Today's Plan Items List */}
        <View className="gap-3">
          {/* Item 1: Current Lesson */}
          <Pressable
            onPress={handleLessonPress}
            className="flex-row items-center p-4 bg-white border border-border-gray rounded-2xl mx-6 active:bg-gray-50"
          >
            {/* Icon */}
            <View className="w-12 h-12 rounded-xl bg-primary/10 justify-center items-center mr-4">
              <Ionicons name="book" size={22} color={COLORS.primary} />
            </View>
            {/* Details */}
            <View className="flex-1">
              <Text className="text-body-lg text-text-primary font-bold">
                Lesson
              </Text>
              <Text className="text-body-sm text-text-secondary mt-0.5" numberOfLines={1}>
                {activeLesson?.title || "Start learning"}
              </Text>
            </View>
            {/* Status marker */}
            <View className="ml-2">
              {isActiveCompleted ? (
                <Ionicons name="checkmark-circle" size={26} color={COLORS.success} />
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-border-gray bg-white" />
              )}
            </View>
          </Pressable>

          {/* Item 2: AI Conversation */}
          <Pressable
            onPress={() => router.push("/chat")}
            className="flex-row items-center p-4 bg-white border border-border-gray rounded-2xl mx-6 active:bg-gray-50"
          >
            {/* Icon */}
            <View className="w-12 h-12 rounded-xl bg-secondary/10 justify-center items-center mr-4">
              <Ionicons name="headset" size={22} color={COLORS.secondary} />
            </View>
            {/* Details */}
            <View className="flex-1">
              <Text className="text-body-lg text-text-primary font-bold">
                AI Conversation
              </Text>
              <Text className="text-body-sm text-text-secondary mt-0.5" numberOfLines={1}>
                Talk about your day
              </Text>
            </View>
            {/* Status marker */}
            <View className="ml-2">
              <View className="w-6 h-6 rounded-full border-2 border-border-gray bg-white" />
            </View>
          </Pressable>

          {/* Item 3: New Words */}
          <Pressable
            onPress={() => router.push("/learn")}
            className="flex-row items-center p-4 bg-white border border-border-gray rounded-2xl mx-6 active:bg-gray-50"
          >
            {/* Icon */}
            <View className="w-12 h-12 rounded-xl bg-error/10 justify-center items-center mr-4">
              <Ionicons name="sparkles" size={22} color={COLORS.error} />
            </View>
            {/* Details */}
            <View className="flex-1">
              <Text className="text-body-lg text-text-primary font-bold">
                New words
              </Text>
              <Text className="text-body-sm text-text-secondary mt-0.5" numberOfLines={1}>
                10 words
              </Text>
            </View>
            {/* Status marker */}
            <View className="ml-2">
              <View className="w-6 h-6 rounded-full border-2 border-border-gray bg-white" />
            </View>
          </Pressable>
        </View>

        {/* Developer Utilities Section */}
        <View className="mx-6 mt-8 mb-10 p-5 bg-surface border border-border-gray rounded-2xl items-center">
          <Text className="text-body-md text-text-secondary font-bold text-center mb-3">
            Developer Utilities
          </Text>
          <View className="flex-row gap-3 w-full justify-between">
            <Pressable
              onPress={() => addXp(5)}
              className="flex-1 bg-white border border-border-gray py-2.5 px-3 rounded-xl items-center active:bg-gray-50"
            >
              <Text className="text-text-primary text-body-sm font-bold">+5 XP</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                resetProgress();
                router.replace("/onboarding");
              }}
              className="flex-1 bg-white border border-error py-2.5 px-3 rounded-xl items-center active:bg-red-50"
            >
              <Text className="text-error text-body-sm font-bold">Reset Progress</Text>
            </Pressable>
          </View>
        </View>
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
