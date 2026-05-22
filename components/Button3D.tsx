import React, { useState } from "react";
import { Pressable, View, Text } from "@/components/tw";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

interface Button3DProps {
  onPress?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "streak" | "outline";
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Button3D = ({
  onPress,
  disabled = false,
  variant = "primary",
  children,
  className = "",
  size = "md",
}: Button3DProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (disabled) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    if (onPress) onPress();
  };

  // Height and offsets based on size
  const heightClass = size === "sm" ? "h-[36px]" : size === "lg" ? "h-[56px]" : "h-[48px]";
  const textClass = size === "sm" ? "text-body-sm font-bold" : size === "lg" ? "text-h4 font-bold uppercase tracking-wider" : "text-body-md font-bold";
  const shadowOffset = size === "sm" ? "translate-y-[2px]" : size === "lg" ? "translate-y-[5px]" : "translate-y-[4px]";
  const roundedClass = "rounded-2xl";

  // Color classes for front face and shadow face
  let frontBg = "bg-primary";
  let shadowBg = "bg-primary-dark";
  let textColor = "text-white";
  let borderClass = "";

  if (disabled) {
    frontBg = "bg-border-gray";
    textColor = "text-text-secondary";
    shadowBg = "bg-transparent"; // no 3D shadow
  } else {
    switch (variant) {
      case "primary":
        frontBg = "bg-primary";
        shadowBg = "bg-primary-dark";
        textColor = "text-white";
        break;
      case "secondary":
        frontBg = "bg-secondary";
        shadowBg = "bg-secondary-dark";
        textColor = "text-white";
        break;
      case "success":
        frontBg = "bg-success";
        shadowBg = "bg-success-dark";
        textColor = "text-white";
        break;
      case "danger":
        frontBg = "bg-error";
        shadowBg = "bg-error-dark";
        textColor = "text-white";
        break;
      case "warning":
        frontBg = "bg-warning";
        shadowBg = "bg-warning-dark";
        textColor = "text-text-primary";
        break;
      case "streak":
        frontBg = "bg-streak";
        shadowBg = "bg-streak-dark";
        textColor = "text-white";
        break;
      case "outline":
        frontBg = "bg-white";
        shadowBg = "bg-border-gray";
        textColor = "text-primary";
        borderClass = "border-2 border-border-gray";
        break;
    }
  }

  return (
    <Pressable
      onPressIn={() => !disabled && setIsPressed(true)}
      onPressOut={() => !disabled && setIsPressed(false)}
      onPress={handlePress}
      disabled={disabled}
      className={`relative w-full ${heightClass} ${className}`}
    >
      {/* Shadow face */}
      {!disabled && (
        <View className={`absolute inset-0 ${shadowBg} ${roundedClass} ${shadowOffset}`} />
      )}
      
      {/* Front face */}
      <View
        className={`absolute inset-0 ${frontBg} ${roundedClass} ${borderClass} items-center justify-center transition-all duration-75 ${
          isPressed && !disabled ? shadowOffset : "translate-y-0"
        }`}
      >
        {typeof children === "string" ? (
          <Text className={`${textColor} ${textClass} text-center`}>{children}</Text>
        ) : (
          children
        )}
      </View>
    </Pressable>
  );
};
export default Button3D;
