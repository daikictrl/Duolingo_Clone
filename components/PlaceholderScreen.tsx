import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "@/components/tw";

interface PlaceholderScreenProps {
  title: string;
  subtitle: string;
}

export function PlaceholderScreen({ title, subtitle }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-h3 text-primary font-bold mb-2 text-center">
          {title}
        </Text>
        <Text className="text-body-md text-text-secondary text-center max-w-[280px]">
          {subtitle}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
