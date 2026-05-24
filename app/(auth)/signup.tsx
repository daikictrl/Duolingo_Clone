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
import { useRouter } from "expo-router";
import { VerificationModal } from "@/components/VerificationModal";
import { useAuth, useSSO } from "@clerk/expo";
import { useSignUp } from "@clerk/expo/legacy";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

function getClerkErrorMessage(err: unknown, defaultMessage: string): string {
  if (err && typeof err === "object" && "errors" in err) {
    const clerkError = err as { errors?: { message?: string }[] };
    if (clerkError.errors && clerkError.errors[0] && clerkError.errors[0].message) {
      return clerkError.errors[0].message;
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return defaultMessage;
}

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [modalError, setModalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, setActive } = useSignUp();
  const { isSignedIn } = useAuth();

  const { startSSOFlow } = useSSO();
  const { height } = useWindowDimensions();

  const spacingClass = height < 780 ? "mb-3" : "mb-6";
  const dividerMarginClass = height < 780 ? "my-2" : "my-4";

  const handleSignUp = async () => {
    if (!signUp) return;
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg("Please enter a valid email and password.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.create({
        emailAddress: trimmedEmail,
        password: trimmedPassword,
      });

      await signUpAttempt.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setIsModalVisible(true);
    } catch (err: unknown) {
      console.warn("Sign up error:", err);
      setErrorMsg(getClerkErrorMessage(err, "Something went wrong during sign up. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    if (!signUp || !setActive) return;
    setModalError("");
    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        console.error("Sign-up attempt not complete:", signUpAttempt);
        setModalError("Sign-up is not complete. Please check the code.");
      }
    } catch (err: unknown) {
      console.warn("Verify code error:", err);
      setModalError(getClerkErrorMessage(err, "Invalid verification code. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) return;
    setModalError("");
    setIsLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
    } catch (err: unknown) {
      console.warn("Resend code error:", err);
      setModalError(getClerkErrorMessage(err, "Failed to resend code. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    if (!setActive || isLoading) return;
    setErrorMsg("");
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleOAuth = async () => {
    if (!setActive || isLoading) return;
    setErrorMsg("");
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  if (signUp?.status === "complete" || isSignedIn) {
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
          <Text className="text-h1 text-text-primary">Create your account</Text>
          <Text className="text-body-md text-text-secondary mt-1">
            Start your language journey today ✨
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

          {/* Password Input Field */}
          <View style={[styles.inputContainer, styles.passwordContainer]}>
            <View className="flex-1">
              <Text className="text-caption text-text-secondary font-medium">
                Password
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="p-2"
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={COLORS.textSecondary}
              />
            </Pressable>
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
            onPress={handleSignUp}
            disabled={!email || !password || isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
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
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/signin")}>
            <Text className="text-primary font-bold text-body-sm">Log in</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Verification Code Bottom Sheet Modal */}
      <VerificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onVerify={handleVerifyCode}
        onResend={handleResendCode}
        email={email}
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
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
