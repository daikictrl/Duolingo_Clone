import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, ScrollView } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Button3D } from "@/components/Button3D";
import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import { useLearningStore } from "@/store/learningStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePostHog } from "posthog-react-native";

export default function LanguageSelectionScreen() {
  const router = useRouter();
  const { selectedLanguageId, setSelectedLanguageId } = useLearningStore();
  const [selectedId, setSelectedId] = useState<string | null>(selectedLanguageId);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<TextInput>(null);
  const posthog = usePostHog();

  useEffect(() => {
    setSelectedId(selectedLanguageId);
  }, [selectedLanguageId]);

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (selectedId) {
      const selectedLang = languages.find((l) => l.id === selectedId);
      posthog.capture("language_selected", {
        language_id: selectedId,
        language_name: selectedLang?.name ?? null,
      });
      setSelectedLanguageId(selectedId);
      // Navigate back to the home screen (/)
      router.replace("/");
    }
  };

  const handleBack = () => {
    if (!selectedLanguageId) return;
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border-gray bg-white">
        {selectedLanguageId ? (
          <Pressable
            onPress={handleBack}
            className="p-1"
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color="#0D132B" />
          </Pressable>
        ) : (
          <View className="w-8 h-8" />
        )}
        <Text className="text-h3 text-text-primary text-center flex-1 mr-6">
          Choose a language
        </Text>
      </View>

      <ScrollView className="flex-1 bg-white" contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <Pressable
          onPress={() => inputRef.current?.focus()}
          className="flex-row items-center bg-surface border border-border-gray rounded-full px-4 py-2.5 mb-6"
        >
          <Ionicons name="search" size={20} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            ref={inputRef}
            placeholder="Search languages"
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-body-md text-text-primary font-sans h-6 p-0"
            style={{ fontFamily: "Poppins-Regular" }}
          />
          {searchQuery !== "" && (
            <Pressable
              onPress={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="p-1"
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={18} color="#6B7280" />
            </Pressable>
          )}
        </Pressable>

        {/* Section Heading */}
        <Text className="text-h3 text-text-primary mb-4">Popular</Text>

        {/* Language Cards */}
        <View className="gap-4 mb-2">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((lang) => {
              const isSelected = selectedId === lang.id;
              return (
                <Pressable
                  key={lang.id}
                  onPress={() => setSelectedId(lang.id)}
                  className={`flex-row items-center p-4 ${
                    isSelected ? "card-3d-selected" : "card-3d"
                  }`}
                >
                  {/* Circle Flag */}
                  <View className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-border-gray justify-center items-center bg-surface">
                    <Image
                      source={lang.flag}
                      className="w-12 h-12 rounded-full"
                      style={{ objectFit: "cover" }}
                    />
                  </View>
                  {/* Text Details */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-body-lg font-bold text-text-primary">
                        {lang.name}
                      </Text>
                      <Text className="text-body-sm text-text-secondary">
                        ({lang.nativeName})
                      </Text>
                    </View>
                    <Text className="text-body-sm text-text-secondary leading-relaxed mt-0.5">
                      {lang.description}
                    </Text>
                  </View>

                  {/* Interactive marker on the right */}
                  <View className="ml-2">
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={24} color="#6C4EF5" />
                    ) : (
                      <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                    )}
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View className="items-center py-8">
              <Text className="text-body-md text-text-secondary text-center">
                No languages found matching &ldquo;{searchQuery}&rdquo;
              </Text>
            </View>
          )}
        </View>

        {/* Earth Vector Illustration */}
        <View className="items-center justify-center mt-0 mb-0">
          <Image
            source={images.earth}
            className="w-100 h-100"
            style={{ objectFit: "contain" }}
          />
        </View>
      </ScrollView>

      {/* Floating Bottom Confirmation Button */}
      <View className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-white border-t border-border-gray">
        <Button3D
          variant="primary"
          size="lg"
          disabled={!selectedId}
          onPress={handleConfirm}
        >
          Confirm Selection
        </Button3D>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
  },
});
