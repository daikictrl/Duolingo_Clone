import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Button3D } from "@/components/Button3D";
import { images } from "@/constants/images";
import { COLORS } from "@/theme/colors";
import { FONTS } from "@/theme/typography";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { VerificationModal } from "@/components/VerificationModal";
import { useAuth, useSSO } from "@clerk/expo";
import { useSignIn } from "@clerk/expo/legacy";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

interface EmailCodeFactor {
  strategy: "email_code";
  emailAddressId: string;
}

function getClerkErrorMessage(err: unknown, defaultMessage: string): string {
  if (err && typeof err === "object" && "errors" in err) {
    const clerkError = err as { errors?: Array<{ message?: string }> };
    if (clerkError.errors && clerkError.errors[0] && clerkError.errors[0].message) {
      return clerkError.errors[0].message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return defaultMessage;
}

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalError, setModalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, setActive } = useSignIn();
  const { isSignedIn } = useAuth();

  const { startSSOFlow } = useSSO();
  const { height } = useWindowDimensions();

  const spacingClass = height < 780 ? "mb-3" : "mb-6";
  const dividerMarginClass = height < 780 ? "my-2" : "my-4";

  const handleSignIn = async () => {
    if (!signIn) return;
    setErrorMsg("");
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      const emailCodeFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      ) as EmailCodeFactor | undefined;

      if (emailCodeFactor) {
        await signInAttempt.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setIsModalVisible(true);
      } else {
        setErrorMsg("Email code verification is not supported. Please contact support.");
      }
    } catch (err: unknown) {
      console.warn("Sign in error:", err);
      setErrorMsg(getClerkErrorMessage(err, "Failed to start sign in. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    if (!signIn || !setActive) return;
    setModalError("");
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error("Sign-in attempt not complete:", signInAttempt);
        setModalError("Sign-in is not complete. Please check the code.");
      }
    } catch (err: unknown) {
      console.warn("Verify code error:", err);
      setModalError(getClerkErrorMessage(err, "Invalid verification code. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signIn) return;
    setModalError("");
    setIsLoading(true);
    try {
      const emailCodeFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      ) as EmailCodeFactor | undefined;

      if (emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
      } else {
        setModalError("Failed to resend code. Factor not found.");
      }
    } catch (err: unknown) {
      console.warn("Resend code error:", err);
      setModalError(getClerkErrorMessage(err, "Failed to resend code. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    if (!setActive) return;
    setErrorMsg("");
    try {
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("/oauth-callback", { scheme: "duolingoclone" }),
      });
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: unknown) {
      console.warn("Google login warning/error:", err);
      setErrorMsg(getClerkErrorMessage(err, "Google login failed."));
    }
  };



  const handleAppleOAuth = async () => {
    if (!setActive) return;
    setErrorMsg("");
    try {
      const { createdSessionId } = await startSSOFlow({
        strategy: "oauth_apple",
        redirectUrl: Linking.createURL("/oauth-callback", { scheme: "duolingoclone" }),
      });
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: unknown) {
      console.warn("Apple login warning/error:", err);
      setErrorMsg(getClerkErrorMessage(err, "Apple login failed."));
    }
  };

  if (isSignedIn) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Back Button */}
        <View className="flex-row items-center justify-start mt-2 mb-4">
          <Pressable
            onPress={() => router.replace("/onboarding")}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </Pressable>
        </View>

        {/* Title Section */}
        <View className="mb-4">
          <Text className="text-h1 text-text-primary">Welcome back</Text>
          <Text className="text-body-md text-text-secondary mt-1">
            Continue your language journey ✨
          </Text>
        </View>

        {/* Waving Mascot illustration */}
        {height > 740 && (
          <View className="items-center my-2">
            <Image
              source={images.mascotAuth}
              className={height < 820 ? "w-20 h-20" : "w-28 h-28"}
              style={{ objectFit: "contain" }}
            />
          </View>
        )}

        {/* Form Fields */}
        <View className={`w-full ${spacingClass}`}>
          {/* Email Input Field */}
          <View style={styles.inputContainer}>
            <Text className="text-caption text-text-secondary font-medium">
              Email
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>
        </View>

        {/* Error message */}
        {errorMsg ? (
          <View className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <Text className="text-red-600 text-body-sm font-semibold">{errorMsg}</Text>
          </View>
        ) : null}

        {/* Action button */}
        <View className={`w-full ${spacingClass}`}>
          <Button3D
            variant="primary"
            size="lg"
            onPress={handleSignIn}
            disabled={!email || isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button3D>
        </View>

        {/* Divider */}
        <View className={`flex-row items-center w-full ${dividerMarginClass}`}>
          <View className="flex-1 h-[1px] bg-border-gray" />
          <Text className="px-4 text-body-sm text-text-secondary font-medium">
            or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-border-gray" />
        </View>

        {/* Social Buttons */}
        <View className="w-full mb-4">
          <Pressable
            onPress={handleGoogleOAuth}
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.socialButtonPressed,
            ]}
          >
            <Ionicons
              name="logo-google"
              size={20}
              color="#EA4335"
              style={{ marginRight: 12 }}
            />
            <Text className="text-text-primary font-bold text-body-md">
              Continue with Google
            </Text>
          </Pressable>

          <Pressable
            onPress={handleAppleOAuth}
            style={({ pressed }) => [
              styles.socialButton,
              pressed && styles.socialButtonPressed,
            ]}
          >
            <Ionicons
              name="logo-apple"
              size={20}
              color="#000000"
              style={{ marginRight: 12 }}
            />
            <Text className="text-text-primary font-bold text-body-md">
              Continue with Apple
            </Text>
          </Pressable>
        </View>

        {/* Footer Navigation Link */}
        <View className="flex-row items-center justify-center mt-4 mb-6">
          <Text className="text-body-sm text-text-secondary">
            {"Don't have an account? "}
          </Text>
          <Pressable onPress={() => router.push("/signup")}>
            <Text className="text-primary font-bold text-body-sm">Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Verification Code Bottom Sheet Modal */}
      <VerificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        email={email || "alex@gmail.com"}
        error={modalError}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    paddingVertical: 4,
    marginTop: 2,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    marginBottom: 12,
  },
  socialButtonPressed: {
    backgroundColor: "#fafafa", // gray-50
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 9999,
  },
  backButtonPressed: {
    backgroundColor: "#f3f4f6", // gray-100
  },
});
