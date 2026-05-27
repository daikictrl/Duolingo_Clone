import React, { useState } from "react";
import { StyleSheet, ScrollView, Alert, Platform, Modal, Pressable as RNPressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/expo";
import { useLearningStore } from "@/store/learningStore";
import { getLanguageById } from "@/data/languages";
import { COLORS } from "@/theme/colors";
import { StatCard } from "@/components/StatCard";

export default function ProfileTab() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const {
    selectedLanguageId,
    xp,
    streak,

    completedFlashcardLessonIds = [],
    completedQuizIds = [],
    resetProgress,
  } = useLearningStore();

  const activeLanguage = selectedLanguageId ? getLanguageById(selectedLanguageId) : null;

  const combinedCompletedCount = new Set([
    ...completedFlashcardLessonIds,
    ...completedQuizIds,
  ]).size;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Joined recently";

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your learning progress, XP, and streak? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetProgress();
            router.replace("/language-selection");
          },
        },
      ]
    );
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/onboarding");
    } catch {
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  // Achievement targets and helper values
  const achievements = [
    {
      id: "streak",
      title: "Streak Flame",
      description: "Keep a daily streak going to build a habit",
      goal: 3,
      current: streak,
      icon: "🔥",
      colorClass: "bg-streak",
      percentage: Math.min((streak / 3) * 100, 100),
    },
    {
      id: "xp",
      title: "XP Collector",
      description: "Earn experience points from lessons and practice",
      goal: 100,
      current: xp,
      icon: "⚡",
      colorClass: "bg-primary",
      percentage: Math.min((xp / 100) * 100, 100),
    },
    {
      id: "lessons",
      title: "Wise Scholar",
      description: "Complete individual course lessons",
      goal: 5,
      current: combinedCompletedCount,
      icon: "🎓",
      colorClass: "bg-success",
      percentage: Math.min((combinedCompletedCount / 5) * 100, 100),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View className="px-6 py-4 border-b border-border-gray bg-white flex-row justify-between items-center">
        <Text className="text-h3 text-text-primary font-bold">Profile</Text>
        <Pressable
          onPress={() => setIsSettingsVisible(true)}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 justify-center items-center active:bg-slate-100"
          accessibilityLabel="Settings"
          accessibilityRole="button"
        >
          <Ionicons name="settings-outline" size={20} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card Header */}
        <View className="flex-row items-center px-6 py-6 border-b border-border-gray/50">
          {/* Avatar frame */}
          <View className="w-20 h-20 rounded-full border-2 border-primary/20 p-0.5 mr-5 shadow-sm bg-slate-50 justify-center items-center overflow-hidden">
            {user?.imageUrl ? (
              <Image
                source={user.imageUrl}
                className="w-full h-full rounded-full"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <View className="w-full h-full rounded-full bg-primary/10 justify-center items-center">
                <Text className="text-primary font-bold text-h2 uppercase">
                  {user?.firstName?.charAt(0) || "U"}
                </Text>
              </View>
            )}
          </View>

          {/* User Meta info */}
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5 flex-wrap">
              <Text className="text-h3 text-text-primary font-bold leading-tight">
                {user?.fullName || "Language Learner"}
              </Text>
              {activeLanguage?.flag && (
                <Image
                  source={activeLanguage.flag}
                  className="w-5 h-4 rounded-sm border border-slate-100"
                  style={{ objectFit: "cover" }}
                />
              )}
            </View>
            <Text className="text-body-sm text-text-secondary mt-0.5">
              {user?.primaryEmailAddress?.emailAddress || "@learner"}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-2 bg-slate-50 self-start px-2 py-0.5 rounded-md border border-slate-100">
              <Ionicons name="calendar-outline" size={13} color={COLORS.textSecondary} />
              <Text className="text-[11px] text-text-secondary font-medium">
                {joinedDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics Grid */}
        <View className="px-6 mt-6">
          <Text className="text-h4 text-text-primary font-bold mb-4">Statistics</Text>
          
          <View className="flex-row gap-4 mb-4">
            <StatCard
              iconName="flame"
              iconColor={COLORS.streak}
              iconBgClass="bg-streak/10"
              value={streak}
              title="Day Streak"
            />
            <StatCard
              iconName="flash"
              iconColor={COLORS.primary}
              iconBgClass="bg-primary/10"
              value={xp}
              title="Total XP"
            />
          </View>

          <View className="flex-row gap-4">
            <StatCard
              iconName="checkmark-circle"
              iconColor={COLORS.success}
              iconBgClass="bg-success/10"
              value={combinedCompletedCount}
              title="Lessons Done"
            />
            <StatCard
              iconName="globe"
              iconColor={COLORS.secondary}
              iconBgClass="bg-secondary/10"
              value={activeLanguage?.name || "None"}
              title="Language"
              numberOfLines={1}
            />
          </View>
        </View>

        {/* Achievements Section */}
        <View className="px-6 mt-8">
          <Text className="text-h4 text-text-primary font-bold mb-4">Achievements</Text>
          
          <View className="gap-4">
            {achievements.map((item) => (
              <View key={item.id} className="p-4 bg-white border border-border-gray rounded-[20px] flex-row items-center">
                {/* Icon Badge */}
                <View className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 justify-center items-center mr-4 shadow-sm relative">
                  <Text className="text-h2 leading-none">{item.icon}</Text>
                  {item.percentage >= 100 && (
                    <View className="absolute -top-1.5 -right-1.5 bg-warning px-1 rounded-full border border-white">
                      <Ionicons name="ribbon" size={10} color={COLORS.textPrimary} />
                    </View>
                  )}
                </View>

                {/* Progress Details */}
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-body-lg text-text-primary font-bold">
                      {item.title}
                    </Text>
                    <Text className="text-caption text-text-secondary font-bold">
                      {item.current} / {item.goal}
                    </Text>
                  </View>
                  
                  <Text className="text-body-sm text-text-secondary leading-tight mb-3">
                    {item.description}
                  </Text>

                  {/* 3D Progress Bar */}
                  <View className="progress-3d-track bg-slate-100">
                    <View
                      style={[styles.progressFill, { width: `${item.percentage}%` }]}
                      className={`progress-3d-fill ${item.colorClass}`}
                    >
                      <View className="progress-3d-gloss" />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSettingsVisible(false)}
      >
        <View style={styles.backdrop}>
          {/* Backdrop tap to dismiss */}
          <RNPressable style={styles.dismissBackdrop} onPress={() => setIsSettingsVisible(false)} />

          {/* Main Settings Card (bottom sheet) */}
          <View className="bg-white w-full rounded-t-3xl px-6 pt-6 pb-12 shadow-2xl relative border-t border-border-gray">
            {/* Grab Handle */}
            <View className="w-12 h-1 bg-border-gray rounded-full self-center mb-6" />

            {/* Close Button */}
            <Pressable
              onPress={() => setIsSettingsVisible(false)}
              className="absolute top-6 right-6 p-2 rounded-full active:bg-slate-100"
              accessibilityLabel="Close settings"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </Pressable>

            {/* Title */}
            <Text className="text-h3 text-text-primary font-bold mb-6">
              Account settings
            </Text>

            {/* Settings Options Card */}
            <View className="border border-border-gray rounded-2xl overflow-hidden bg-white mb-6">
              {/* Setting 1: Switch Language */}
              <Pressable
                onPress={() => {
                  setIsSettingsVisible(false);
                  router.push("/language-selection");
                }}
                className="flex-row items-center justify-between p-4 border-b border-border-gray active:bg-slate-50"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="language-outline" size={20} color={COLORS.textPrimary} />
                  <Text className="text-body-lg text-text-primary font-medium">Switch Path Language</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
              </Pressable>

              {/* Setting 2: Reset Progress */}
              <Pressable
                onPress={() => {
                  setIsSettingsVisible(false);
                  setTimeout(() => {
                    handleResetProgress();
                  }, 100);
                }}
                className="flex-row items-center justify-between p-4 active:bg-slate-50"
              >
                <View className="flex-row items-center gap-3">
                  <Ionicons name="refresh-outline" size={20} color={COLORS.error} />
                  <Text className="text-body-lg text-error font-medium">Reset Progress</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
              </Pressable>
            </View>

            {/* Clerk Sign Out Button */}
            <Pressable
              onPress={() => {
                setIsSettingsVisible(false);
                setTimeout(() => {
                  handleSignOut();
                }, 100);
              }}
              style={styles.signOutButton}
              className="w-full bg-[#FFEBEB] py-4 rounded-2xl border-2 border-error border-b-[5px] border-b-error-dark items-center justify-center active:translate-y-0.5 active:border-b-2"
            >
              <View className="flex-row items-center gap-2">
                <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                <Text className="text-error font-black text-body-lg uppercase tracking-wider">
                  Sign Out
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  progressFill: {
    height: "100%",
    borderRadius: 9999,
  },
  signOutButton: {
    ...Platform.select({
      ios: {
        shadowColor: "#FF4D4F",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(13, 19, 43, 0.4)",
    justifyContent: "flex-end",
  },
  dismissBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
