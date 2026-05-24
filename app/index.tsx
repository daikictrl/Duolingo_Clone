import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/tw";
import { Button3D } from "@/components/Button3D";
import { useRouter, Href } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function Index() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/onboarding" as Href);
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>GROUP FIVE</Text>
      
      <View className="w-64 mt-8 px-4 gap-4">
        <Button3D
          variant="primary"
          size="md"
          onPress={() => router.push("/onboarding" as Href)}
        >
          Open Onboarding
        </Button3D>

        <Button3D
          variant="danger"
          size="md"
          onPress={handleSignOut}
        >
          Sign Out
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
    fontWeight: "bold",
    color: "#0D132B",
  },
});
