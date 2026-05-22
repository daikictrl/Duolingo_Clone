import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/tw";
import { Button3D } from "@/components/Button3D";
import { useRouter, Href } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>yoo joseph</Text>
      
      <View className="w-64 mt-8 px-4">
        <Button3D
          variant="primary"
          size="md"
          onPress={() => router.push("/onboarding" as Href)}
        >
          Open Onboarding
        </Button3D>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 15,
    color: "#0D132B",
  },
});
