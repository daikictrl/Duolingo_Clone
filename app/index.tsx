import React, { useState } from "react";
import { StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, Pressable } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { images } from "@/constants/images";
import { colors } from "@/theme/colors";

export default function Index() {
  const [activeTab, setActiveTab] = useState<"preview" | "colors" | "typography">("preview");

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation / Brand Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border bg-white">
        <View className="flex-row items-center gap-3">
          <Image
            source={images.moscotLogo}
            className="w-10 h-10"
            contentFit="contain"
          />
          <Text className="text-h2 text-text-primary">lingua</Text>
        </View>
        <View className="flex-row items-center bg-surface rounded-full p-1 border border-border">
          <Pressable
            onPress={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "preview" ? "bg-white" : ""
            }`}
            style={activeTab === "preview" ? styles.tabActiveShadow : undefined}
          >
            <Text
              className={`text-body-small font-poppins-semibold ${
                activeTab === "preview" ? "text-lingua-purple" : "text-text-secondary"
              }`}
            >
              Sandbox
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("colors")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "colors" ? "bg-white" : ""
            }`}
            style={activeTab === "colors" ? styles.tabActiveShadow : undefined}
          >
            <Text
              className={`text-body-small font-poppins-semibold ${
                activeTab === "colors" ? "text-lingua-purple" : "text-text-secondary"
              }`}
            >
              Colors
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("typography")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "typography" ? "bg-white" : ""
            }`}
            style={activeTab === "typography" ? styles.tabActiveShadow : undefined}
          >
            <Text
              className={`text-body-small font-poppins-semibold ${
                activeTab === "typography" ? "text-lingua-purple" : "text-text-secondary"
              }`}
            >
              Typography
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "preview" && (
          <View className="gap-8">
            {/* Mascot Banner */}
            <View
              className="bg-surface border border-border rounded-3xl p-6 items-center gap-4"
              style={styles.cardShadow}
            >
              <Image
                source={images.mascotWelcome}
                className="w-48 h-48"
                contentFit="contain"
              />
              <View className="items-center gap-1">
                <Text className="text-h1 text-text-primary text-center">
                  Welcome to Lingua!
                </Text>
                <Text className="text-body-large text-text-secondary text-center max-w-[280px]">
                  Learn languages playfully with our smart AI assistant.
                </Text>
              </View>
            </View>

            {/* Streak & Stat Cards */}
            <View className="flex-row gap-4">
              <View
                className="flex-1 bg-surface border border-border rounded-2xl p-4 flex-row items-center gap-3"
                style={styles.cardShadow}
              >
                <Image
                  source={images.streakFire}
                  className="w-10 h-10"
                  contentFit="contain"
                />
                <View>
                  <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider">
                    STREAK
                  </Text>
                  <Text className="text-h3 text-streak font-poppins-bold">3 Days</Text>
                </View>
              </View>

              <View
                className="flex-1 bg-surface border border-border rounded-2xl p-4 flex-row items-center gap-3"
                style={styles.cardShadow}
              >
                <Image
                  source={images.treasure}
                  className="w-10 h-10"
                  contentFit="contain"
                />
                <View>
                  <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider">
                    XP POINTS
                  </Text>
                  <Text className="text-h3 text-lingua-purple font-poppins-bold">120 XP</Text>
                </View>
              </View>
            </View>

            {/* Interactive Components Sandbox */}
            <View className="gap-4">
              <Text className="text-h3 text-text-primary">Interactive 3D Buttons</Text>
              
              <Pressable className="bg-lingua-purple border-b-4 border-lingua-deep-purple rounded-2xl py-4 px-6 active:translate-y-[2px] active:border-b-2">
                <Text className="text-white text-center text-body-large font-poppins-bold tracking-wider">
                  GET STARTED
                </Text>
              </Pressable>

              <Pressable className="bg-lingua-green border-b-4 border-emerald-600 rounded-2xl py-4 px-6 active:translate-y-[2px] active:border-b-2">
                <Text className="text-white text-center text-body-large font-poppins-bold tracking-wider">
                  START LESSON
                </Text>
              </Pressable>

              <Pressable className="bg-white border-2 border-border border-b-4 rounded-2xl py-4 px-6 active:translate-y-[2px] active:border-b-2">
                <Text className="text-text-primary text-center text-body-large font-poppins-bold tracking-wider">
                  I ALREADY HAVE AN ACCOUNT
                </Text>
              </Pressable>
            </View>

            {/* Language Selector Preview */}
            <View className="gap-4">
              <Text className="text-h3 text-text-primary">Language Pickers</Text>
              
              <View
                className="bg-white border-2 border-lingua-blue rounded-2xl p-4 flex-row items-center justify-between"
                style={styles.cardShadow}
              >
                <View className="flex-row items-center gap-4">
                  <Image
                    source={images.earth}
                    className="w-12 h-12 rounded-xl"
                    contentFit="contain"
                  />
                  <View>
                    <Text className="text-h4 text-text-primary">Spanish</Text>
                    <Text className="text-body-small text-text-secondary">2.5M learners</Text>
                  </View>
                </View>
                <View className="w-6 h-6 rounded-full border-2 border-lingua-blue bg-lingua-blue items-center justify-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                </View>
              </View>

              <View
                className="bg-white border-2 border-border rounded-2xl p-4 flex-row items-center justify-between opacity-80"
              >
                <View className="flex-row items-center gap-4">
                  <Image
                    source={images.palace}
                    className="w-12 h-12 rounded-xl"
                    contentFit="contain"
                  />
                  <View>
                    <Text className="text-h4 text-text-primary">French</Text>
                    <Text className="text-body-small text-text-secondary">1.8M learners</Text>
                  </View>
                </View>
                <View className="w-6 h-6 rounded-full border-2 border-border" />
              </View>
            </View>
          </View>
        )}

        {activeTab === "colors" && (
          <View className="gap-6">
            <View>
              <Text className="text-h3 text-text-primary mb-1">Color Palette</Text>
              <Text className="text-body-medium text-text-secondary">
                Tailwind CSS v4 CSS variables mapped to design guidelines.
              </Text>
            </View>

            {/* Primary Colors */}
            <View className="gap-3">
              <Text className="text-h4 text-text-primary">Primary Brand Colors</Text>
              <View className="gap-2">
                <ColorRow name="Lingua Purple" hex="#6C4EF5" bgClass="bg-lingua-purple" textClass="text-white" />
                <ColorRow name="Lingua Deep Purple" hex="#5B3BF6" bgClass="bg-lingua-deep-purple" textClass="text-white" />
                <ColorRow name="Lingua Blue" hex="#4D8BFF" bgClass="bg-lingua-blue" textClass="text-text-primary" />
                <ColorRow name="Lingua Green" hex="#21C16B" bgClass="bg-lingua-green" textClass="text-white" />
              </View>
            </View>

            {/* Semantic Colors */}
            <View className="gap-3">
              <Text className="text-h4 text-text-primary">Semantic Indicators</Text>
              <View className="gap-2">
                <ColorRow name="Success" hex="#21C16B" bgClass="bg-success" textClass="text-white" />
                <ColorRow name="Warning" hex="#FFC800" bgClass="bg-warning" textClass="text-text-primary" />
                <ColorRow name="Streak" hex="#FF8A00" bgClass="bg-streak" textClass="text-white" />
                <ColorRow name="Error" hex="#FF4D4F" bgClass="bg-error" textClass="text-white" />
                <ColorRow name="Info" hex="#4D8BFF" bgClass="bg-info" textClass="text-text-primary" />
              </View>
            </View>

            {/* Neutrals */}
            <View className="gap-3">
              <Text className="text-h4 text-text-primary">Neutrals</Text>
              <View className="gap-2">
                <ColorRow name="Text Primary" hex="#0D132B" bgClass="bg-text-primary" textClass="text-white" />
                <ColorRow name="Text Secondary" hex="#6B7280" bgClass="bg-text-secondary" textClass="text-white" />
                <ColorRow name="Border" hex="#E5E7EB" bgClass="bg-border" textClass="text-text-primary" />
                <ColorRow name="Surface" hex="#F6F7FB" bgClass="bg-surface" textClass="text-text-primary" />
                <ColorRow name="Background" hex="#FFFFFF" bgClass="bg-background border border-border" textClass="text-text-primary" />
              </View>
            </View>
          </View>
        )}

        {activeTab === "typography" && (
          <View className="gap-6">
            <View>
              <Text className="text-h3 text-text-primary mb-1">Typography Scale</Text>
              <Text className="text-body-medium text-text-secondary">
                Using Poppins loaded asynchronously via expo-font.
              </Text>
            </View>

            <View className="bg-surface border border-border rounded-2xl p-4 gap-6" style={styles.cardShadow}>
              <View className="border-b border-border pb-4">
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">H1 (32px, Bold, Line Height 1.2)</Text>
                <Text className="text-h1 text-text-primary">DuoLearn Screen Title</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">H2 (24px, SemiBold, Line Height 1.3)</Text>
                <Text className="text-h2 text-text-primary">Section Heading</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">H3 (20px, SemiBold, Line Height 1.3)</Text>
                <Text className="text-h3 text-text-primary">Card & Module Titles</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">H4 (16px, Medium, Line Height 1.4)</Text>
                <Text className="text-h4 text-text-primary">Section Subheadings</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">Body Large (16px, Regular, Line Height 1.6)</Text>
                <Text className="text-body-large text-text-primary">Important content and primary readability body copy text.</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">Body Medium (14px, Regular, Line Height 1.6)</Text>
                <Text className="text-body-medium text-text-primary">Standard body descriptions, definitions and informative text blocks.</Text>
              </View>

              <View className="border-b border-border pb-4">
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">Body Small (13px, Regular, Line Height 1.6)</Text>
                <Text className="text-body-small text-text-secondary">Supporting captions, secondary labels, and descriptive helper text.</Text>
              </View>

              <View>
                <Text className="text-caption text-text-secondary uppercase font-poppins-semibold tracking-wider mb-2">Caption (11px, Regular, Line Height 1.4)</Text>
                <Text className="text-caption text-text-secondary">META LABELS, FOOTNOTES & DETAIL METADATA</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface ColorRowProps {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
}

function ColorRow({ name, hex, bgClass, textClass }: ColorRowProps) {
  return (
    <View className="flex-row items-center justify-between bg-white border border-border rounded-xl p-3">
      <View className="flex-row items-center gap-3">
        <View className={`w-10 h-10 rounded-lg ${bgClass}`} />
        <View>
          <Text className="text-body-medium font-poppins-semibold text-text-primary">{name}</Text>
          <Text className="text-caption text-text-secondary">{hex}</Text>
        </View>
      </View>
      <View className={`px-2.5 py-1 rounded bg-surface border border-border`}>
        <Text className="text-caption font-mono text-text-secondary">{bgClass}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutrals.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 4px 12px rgba(13, 19, 43, 0.08)",
      },
    }),
  },
  tabActiveShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
});
