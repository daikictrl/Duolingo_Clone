import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Platform,
  Pressable as RNPressable,
} from "react-native";
import { View, Text, Pressable } from "@/components/tw";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/theme/colors";

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
  email: string;
  onResend?: () => void;
  error?: string;
}

export const VerificationModal = ({
  visible,
  onClose,
  onVerify,
  email,
  onResend,
  error,
}: VerificationModalProps) => {
  const [code, setCode] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (visible) {
      setCode("");
      // Add a small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Listen to code entry changes
  const handleCodeChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setCode(cleaned);
    
    // Automatically trigger verification once 6 digits are typed
    if (cleaned.length === 6) {
      onVerify(cleaned);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const digits = Array(6).fill(0);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Top backdrop area dismisses modal when tapped */}
        <RNPressable style={styles.dismissBackdrop} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoiding}
        >
          {/* Main Modal Card (sliding bottom sheet) */}
          <View className="bg-white w-full rounded-t-3xl px-6 pt-6 pb-12 shadow-2xl relative border-t border-border-gray">
            
            {/* Grab Handle */}
            <View className="w-12 h-1 bg-border-gray rounded-full self-center mb-6" />

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              accessibilityLabel="Close verification dialog"
              accessibilityRole="button"
              accessibilityHint="Closes the verification screen and returns to the authentication form"
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </Pressable>

            {/* Header Content */}
            <View className="items-center mb-6">
              <View className="bg-indigo-50 p-3 rounded-full mb-3">
                <Ionicons name="mail-open-outline" size={32} color={COLORS.primary} />
              </View>
              <Text className="text-h2 text-text-primary text-center">
                Verify your email
              </Text>
              <Text className="text-body-md text-text-secondary text-center mt-2 px-4 leading-relaxed">
                We sent a 6-digit code to{"\n"}
                <Text className="font-semibold text-text-primary">{email || "your email"}</Text>
              </Text>
            </View>

            {/* Invisible real TextInput */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              maxLength={6}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              style={styles.hiddenInput}
              caretHidden={true}
              accessibilityLabel="One-time passcode input"
              accessibilityHint="Enter the 6-digit code sent to your device"
            />

            {/* Styled Code Box Grid */}
            <RNPressable
              onPress={focusInput}
              style={styles.boxesContainer}
              accessibilityLabel="Verification code digits"
              accessibilityHint="Double tap to focus and type the 6-digit verification code"
              accessibilityRole="button"
            >
              {digits.map((_, index) => {
                const char = code[index] || "";
                const isCurrent = code.length === index && isInputFocused;

                return (
                  <View
                    key={index}
                    style={[
                      styles.codeBox,
                      isCurrent && styles.codeBoxFocused,
                    ]}
                  >
                    {char ? (
                      <Text className="text-h2 text-text-primary font-bold">
                        {char}
                      </Text>
                    ) : (
                      // Subtle dot indicator for empty boxes
                      <View className="w-2.5 h-2.5 rounded-full bg-border-gray" />
                    )}
                  </View>
                );
              })}
            </RNPressable>

            {error ? (
              <Text style={{ textAlign: "center", color: "#EF4444", fontSize: 14, fontWeight: "600", marginTop: 8, paddingHorizontal: 16 }}>
                {error}
              </Text>
            ) : null}

            {/* Resend Action */}
            <View className="items-center mt-6">
              <Text className="text-body-sm text-text-secondary">
                {"Didn't receive the email?"}
              </Text>
              <Pressable
                onPress={() => {
                  setCode("");
                  if (onResend) {
                    onResend();
                  } else {
                    focusInput();
                  }
                }}
                accessibilityLabel="Resend code"
                accessibilityRole="button"
                accessibilityHint="Sends a new 6-digit verification code to your email"
                style={({ pressed }) => [
                  styles.resendButton,
                  pressed && styles.resendButtonPressed,
                ]}
              >
                <Text className="text-primary font-semibold text-body-sm">
                  Resend Code
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  keyboardAvoiding: {
    width: "100%",
    justifyContent: "flex-end",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  codeBox: {
    width: 44,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  codeBoxFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
    borderRadius: 9999,
  },
  closeButtonPressed: {
    backgroundColor: "#f3f4f6", // gray-100
  },
  resendButton: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resendButtonPressed: {
    backgroundColor: "#eef2ff", // indigo-50
  },
});
