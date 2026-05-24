import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Button3D } from "@/components/Button3D";
import { images } from "@/constants/images";
import { COLORS } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { usePostHog } from "posthog-react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuth();
  const posthog = usePostHog();

  const handleGetStarted = async () => {
    posthog.capture("onboarding_get_started_tapped");

    try {
      if (isSignedIn) {
        await signOut();
      }
    } catch (err) {
      console.warn("Failed to sign out on onboarding:", err);
    }
    // Navigate to Sign Up screen
    router.push("/signup");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 px-6 justify-between py-6 bg-surface">
        {/* Header Section */}
        <View className="items-center mt-2">
          <View className="flex-row items-center gap-2">
            <Image
              source={images.mascotLogo}
              className="w-10 h-10"
              style={{ objectFit: "contain" }}
            />
            <Text className="text-h3 text-text-primary">Vexora</Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="items-center flex-1 justify-center my-6">
          {/* Main Headings */}
          <Text className="text-h1 text-text-primary text-center">
            Your AI language{"\n"}
            <Text className="text-primary">teacher.</Text>
          </Text>

          {/* Subheading */}
          <Text className="text-body-md text-text-secondary text-center max-w-[280px] leading-relaxed mt-4 mb-8">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>

          {/* Illustration Container */}
          <View className="relative w-full h-[260px] justify-center items-center">
            {/* Top-Right Speech Bubble ("¡Hola!") */}
            <View className="absolute -top-2 right-[8%] bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-2xl shadow-sm z-10 will-change-variable">
              <Text className="text-body-sm font-bold text-indigo-600">¡Hola!</Text>
              {/* Arrow pointer pointing down-left to the mascot */}
              <View className="absolute -bottom-1.5 left-5 w-3 h-3 bg-indigo-50 border-r border-b border-indigo-200 rotate-45" />
            </View>

            {/* Left Speech Bubble ("Hello!") */}
            <View className="absolute top-[35%] left-[6%] bg-sky-50 border border-sky-200 px-3.5 py-1.5 rounded-2xl shadow-sm z-10 will-change-variable">
              <Text className="text-body-sm font-bold text-sky-700">Hello!</Text>
              {/* Arrow pointer pointing down-right to the mascot */}
              <View className="absolute -bottom-1.5 right-6 w-3 h-3 bg-sky-50 border-r border-b border-sky-200 rotate-45" />
            </View>

            {/* Main Mascot Image */}
            <Image
              source={images.mascotWelcome}
              className="w-44 h-44"
              style={{ objectFit: "contain" }}
            />

            {/* Bottom-Right Speech Bubble ("你好!") */}
            <View className="absolute bottom-[10%] right-[8%] bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-2xl shadow-sm z-10 will-change-variable">
              <Text className="text-body-sm font-bold text-orange-600">你好!</Text>
              {/* Arrow pointer pointing down-left to the mascot */}
              <View className="absolute -bottom-1.5 left-5 w-3 h-3 bg-orange-50 border-r border-b border-orange-200 rotate-45" />
            </View>
          </View>
        </View>

        {/* Footer Actions */}
        <View className="mb-4">
          <Button3D variant="primary" size="lg" onPress={handleGetStarted}>
            <View className="w-full flex-row items-center justify-center relative">
              <Text className="text-white text-h4 font-bold uppercase tracking-wider">
                Get Started
              </Text>
              <View className="absolute right-4">
                <Ionicons name="chevron-forward" size={18} color="white" />
              </View>
            </View>
          </Button3D>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
});
