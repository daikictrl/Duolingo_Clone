import "../global.css";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ActivityIndicator, View } from "react-native";
import { useLearningStore } from "@/store/learningStore";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {});

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Please add it to your .env file."
  );
}

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const selectedLanguageId = useLearningStore((state) => state.selectedLanguageId);
  const _hasHydrated = useLearningStore((state) => state._hasHydrated);

  useEffect(() => {
    if (!isLoaded || !_hasHydrated) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";
    const inLanguageSelection = segments[0] === "language-selection";
    const inOauthCallback = segments[0] === "oauth-callback";

    if (inOauthCallback && !isSignedIn) return;

    if (!isSignedIn) {
      // Redirect to onboarding if not signed in and trying to access protected content
      if (!inAuthGroup && !inOnboarding) {
        router.replace("/onboarding");
      }
    } else {
      // If signed in
      if (!selectedLanguageId) {
        // Redirect to language selection if authenticated but no language is chosen
        if (!inLanguageSelection) {
          router.replace("/language-selection");
        }
      } else {
        // Redirect to home if signed in, has language selected, and trying to access signin/signup/onboarding page
        if (inAuthGroup || inOnboarding || inOauthCallback) {
          router.replace("/");
        }
      }
    }
  }, [isSignedIn, isLoaded, _hasHydrated, selectedLanguageId, segments, router]);

  if (!isLoaded || !_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator size="large" color="#6C4EF5" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}


export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
