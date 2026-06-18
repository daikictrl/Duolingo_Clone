import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLearningStore } from "@/store/learningStore";
import { getFlashcardLessonsByLanguage } from "@/data/flashcardLessons";
import { getQuizzesByLanguage } from "@/data/quizzes";
import { COLORS } from "@/theme/colors";
import { images } from "@/constants/images";

type TabType = "flashcards" | "quizzes";

export default function LearnTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("flashcards");

  const {
    selectedLanguageId,
    completedFlashcardLessonIds,
    completedQuizIds,
    flashcardScores,
    quizScores,
    xp,
  } = useLearningStore();

  const langCode = selectedLanguageId || "es";

  // Get active lessons and quizzes for selected language
  const flashcardLessons = getFlashcardLessonsByLanguage(langCode);
  const quizzes = getQuizzesByLanguage(langCode);

  const getLanguageName = (code: string) => {
    switch (code) {
      case "es":
        return "Spanish";
      case "fr":
        return "French";
      case "ja":
        return "Japanese";
      default:
        return "Language";
    }
  };

  const handleStartFlashcards = (lessonId: string) => {
    router.push({
      pathname: "/lesson/flashcards" as any,
      params: { lessonId },
    });
  };

  const handleStartQuiz = (quizId: string) => {
    router.push({
      pathname: "/lesson/quiz" as any,
      params: { quizId },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-gray bg-white">
        <Pressable
          onPress={() => router.replace("/(tabs)" as any)}
          className="w-11 h-11 rounded-full border border-border-gray bg-surface justify-center items-center active:bg-gray-100"
          accessibilityLabel="Back to home"
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={20} color="#1E293B" />
        </Pressable>

        <View className="flex-1 items-center px-4">
          <Text
            className="text-[18px] font-extrabold text-slate-800 text-center capitalize"
            numberOfLines={1}
          >
            {getLanguageName(langCode)} course
          </Text>
          <Text className="text-[12px] text-text-secondary font-bold text-center mt-0.5">
            Total XP: {xp} XP
          </Text>
        </View>

        <Pressable
          className="w-11 h-11 rounded-full border border-border-gray bg-surface justify-center items-center active:bg-gray-100"
          accessibilityLabel="Bookmark unit"
          accessibilityRole="button"
        >
          <Ionicons name="ribbon" size={20} color="#EAB308" />
        </Pressable>
      </View>

      {/* Main Content ScrollView with sticky tab switcher */}
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* Child 0: Top Image (Palace) - scrolls normally */}
        <View className="w-full justify-center items-center py-4 bg-white">
          <Image
            source={images.palace}
            className="w-120 h-90"
            style={{ objectFit: "contain" }} 
          />
        </View>

        {/* Child 1: 2-Tab Pill Switcher - STICKY on scroll */}
        <View className="px-6 py-2 bg-white">
          <View className="p-1 bg-surface rounded-2xl flex-row items-center border border-border-gray shadow-sm">
            <Pressable
              onPress={() => setActiveTab("flashcards")}
              className={`flex-1 py-3 rounded-xl items-center justify-center flex-row gap-1.5 transition-all will-change-variable ${
                activeTab === "flashcards" ? "bg-white shadow-sm border border-border-gray" : ""
              }`}
            >
              <Ionicons
                name="book"
                size={16}
                color={activeTab === "flashcards" ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                className={`text-body-xs font-black uppercase tracking-wider ${
                  activeTab === "flashcards" ? "text-primary font-extrabold" : "text-text-secondary font-bold"
                }`}
              >
                Flashcards
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("quizzes")}
              className={`flex-1 py-3 rounded-xl items-center justify-center flex-row gap-1.5 transition-all will-change-variable ${
                activeTab === "quizzes" ? "bg-white shadow-sm border border-border-gray" : ""
              }`}
            >
              <Ionicons
                name="extension-puzzle"
                size={16}
                color={activeTab === "quizzes" ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                className={`text-body-xs font-black uppercase tracking-wider ${
                  activeTab === "quizzes" ? "text-primary font-extrabold" : "text-text-secondary font-bold"
                }`}
              >
                Quizzes
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Child 2: Tab content - scrolls beneath sticky header */}
        <View className="mx-6 mt-4">
          {activeTab === "flashcards" && (
            <View className="gap-4">
              {flashcardLessons.map((lesson) => {
                const isCompleted = completedFlashcardLessonIds.includes(lesson.id);
                const score = flashcardScores[lesson.id] || 0;

                let statusColor: string = COLORS.success;
                let statusBg = "bg-success/10";
                let statusText = "Completed";
                let iconName: any = "checkmark-sharp";

                if (isCompleted) {
                  if (score <= 0) {
                    statusColor = COLORS.error;
                    statusBg = "bg-error/10";
                    statusText = "Failed";
                    iconName = "close-sharp";
                  } else if (score < 100) {
                    statusColor = COLORS.warning;
                    statusBg = "bg-amber-500/10";
                    statusText = "Incomplete";
                    iconName = "alert-circle";
                  } else {
                    statusColor = COLORS.success;
                    statusBg = "bg-success/10";
                    statusText = "Completed";
                    iconName = "checkmark-sharp";
                  }
                }

                return (
                  <Pressable
                    key={lesson.id}
                    onPress={() => handleStartFlashcards(lesson.id)}
                    className="p-4 card-3d bg-white flex-row items-center justify-between mb-3 active:opacity-95"
                    style={{
                      borderBottomWidth: 4,
                      borderBottomColor: "#E2E8F0",
                    }}
                  >
                    <View className="flex-1 pr-3">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                          {lesson.difficulty}
                        </Text>
                        {isCompleted && (
                          <View className={`${statusBg} px-2 py-0.5 rounded flex-row items-center`}>
                            <Ionicons name={iconName} size={10} color={statusColor} />
                            <Text style={{ color: statusColor }} className="text-[9px] font-black uppercase ml-0.5">
                              {statusText} ({Math.round(score)}%)
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <Text className="text-[18px] font-bold text-slate-800">
                        {lesson.title}
                      </Text>
                      
                      <Text className="text-[13px] text-slate-500 mt-1">
                        Learn {lesson.cards.length} essential cards with pronunciation.
                      </Text>
                    </View>

                    <View className="w-11 h-11 rounded-2xl bg-primary/10 items-center justify-center border border-slate-100">
                      <Ionicons name="flash" size={22} color={COLORS.primary} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {activeTab === "quizzes" && (
            <View className="gap-4">
              {quizzes.map((quizItem) => {
                const isCompleted = completedQuizIds.includes(quizItem.id);
                const score = quizScores[quizItem.id] || 0;

                let statusColor: string = COLORS.success;
                let statusBg = "bg-success/10";
                let statusText = "Completed";
                let iconName: any = "checkmark-sharp";

                if (isCompleted) {
                  if (score <= 0) {
                    statusColor = COLORS.error;
                    statusBg = "bg-error/10";
                    statusText = "Failed";
                    iconName = "close-sharp";
                  } else if (score < 100) {
                    statusColor = COLORS.warning;
                    statusBg = "bg-amber-500/10";
                    statusText = "Incomplete";
                    iconName = "alert-circle";
                  } else {
                    statusColor = COLORS.success;
                    statusBg = "bg-success/10";
                    statusText = "Completed";
                    iconName = "checkmark-sharp";
                  }
                }

                return (
                  <Pressable
                    key={quizItem.id}
                    onPress={() => handleStartQuiz(quizItem.id)}
                    className="p-4 card-3d bg-white flex-row items-center justify-between mb-3 active:opacity-95"
                    style={{
                      borderBottomWidth: 4,
                      borderBottomColor: "#E2E8F0",
                    }}
                  >
                    <View className="flex-1 pr-3">
                      <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                          {quizItem.category}
                        </Text>
                        {isCompleted && (
                          <View className={`${statusBg} px-2 py-0.5 rounded flex-row items-center`}>
                            <Ionicons name={iconName} size={10} color={statusColor} />
                            <Text style={{ color: statusColor }} className="text-[9px] font-black uppercase ml-0.5">
                              {statusText} ({Math.round(score)}%)
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <Text className="text-[18px] font-bold text-slate-800">
                        {quizItem.title}
                      </Text>
                      
                      <Text className="text-[13px] text-slate-500 mt-1">
                        Test yourself with {quizItem.questions.length} questions.
                      </Text>
                    </View>

                    <View className="w-11 h-11 rounded-2xl bg-secondary/10 items-center justify-center border border-slate-100">
                      <Ionicons name="extension-puzzle" size={22} color={COLORS.secondary} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}
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
    paddingBottom: 40,
  },
});
