import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, TextInput } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Ionicons } from "@expo/vector-icons";
import { useLearningStore } from "@/store/learningStore";
import { chatScenarios, ChatScenario } from "@/data/chatScenarios";
import { getLanguageById } from "@/data/languages";
import { COLORS } from "@/theme/colors";
import { images } from "@/constants/images";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { fetchAIResponse } from "@/lib/ai";

export default function ChatTab() {
  const { selectedLanguageId, xp, addXp } = useLearningStore();

  // Local state to override language selection inside the chat tab for practice flexibility
  const [practiceLanguageId, setPracticeLanguageId] = useState<string | null>(null);
  const activeLangId = practiceLanguageId || selectedLanguageId || "es";
  
  // Scenarios available for active language
  const scenarios = chatScenarios[activeLangId] || chatScenarios["es"];
  const activeLanguageName = getLanguageById(activeLangId)?.name || "Spanish";
  const activeLanguageFlag = getLanguageById(activeLangId)?.flag || "https://flagcdn.com/w320/es.png";

  const hasApiKey = !!(process.env.EXPO_PUBLIC_OPEN_ROUTER_API_KEY);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      Speech.stop().catch(() => {});
    };
  }, []);

  // Active chat state
  const [activeScenario, setActiveScenario] = useState<ChatScenario | null>(null);
  const [messages, setMessages] = useState<
    {
      id: string;
      sender: "ai" | "user";
      text: string;
      translation?: string;
      showTranslation?: boolean;
    }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dialogueTurnIndex, setDialogueTurnIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [typingDots, setTypingDots] = useState(".");
  const [dynamicSuggestions, setDynamicSuggestions] = useState<{
    text: string;
    translation: string;
  }[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const isMountedRef = useRef(true);
  const demoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const [suggestionHeight, setSuggestionHeight] = useState(0);

  const shouldHideSuggestions = inputText.trim().length > 0 || isTyping;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: shouldHideSuggestions ? (suggestionHeight || 150) : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [shouldHideSuggestions, suggestionHeight]);

  // Track mount status for async safety
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
        demoTimeoutRef.current = null;
      }
    };
  }, []);

  // Auto-scroll to end of chat when messages or typing state changes
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  // Typing indicator dots micro-animation
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingDots((prev) => {
          if (prev === "...") return ".";
          return prev + ".";
        });
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  // Start a dialogue scenario
  const handleStartScenario = (scenario: ChatScenario) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setActiveScenario(scenario);
    setDialogueTurnIndex(0);
    setIsComplete(false);
    setIsTyping(false);
    setInputText("");
    
    const firstTurn = scenario.dialogue[0];
    setDynamicSuggestions(firstTurn.suggestions);
    setMessages([
      {
        id: `ai-0`,
        sender: "ai",
        text: firstTurn.aiText,
        translation: firstTurn.translation,
        showTranslation: false,
      },
    ]);
  };

  const fallbackToStatic = (nextIndex: number, totalTurns: number) => {
    if (nextIndex < totalTurns && activeScenario) {
      const nextTurn = activeScenario.dialogue[nextIndex];
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${nextIndex}`,
          sender: "ai",
          text: nextTurn.aiText,
          translation: nextTurn.translation,
          showTranslation: false,
        },
      ]);
      setDynamicSuggestions(nextTurn.suggestions);
    } else {
      // Dialogue ends
      Speech.stop().catch(() => {});
      setIsComplete(true);
      addXp(activeScenario?.xpReward || 15);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  };

  // Send message handler
  const handleSendMessage = async (customText?: string, translationText?: string) => {
    if (isTyping) return;
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activeScenario) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});

    // Attempt to resolve translation if not provided (e.g. user typed a match to suggestions)
    let resolvedTranslation = translationText;
    if (!resolvedTranslation) {
      const match = suggestions.find(
        (s) => s.text.toLowerCase().trim() === textToSend.toLowerCase().trim()
      );
      if (match) {
        resolvedTranslation = match.translation;
      } else if (!hasApiKey) {
        resolvedTranslation = "Configure API key to translate custom messages.";
      }
    }
    
    // 1. Add user message
    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: "user" as const,
      text: textToSend.trim(),
      translation: resolvedTranslation,
      showTranslation: false,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Advance the conversation turn
    const nextIndex = dialogueTurnIndex + 1;
    const totalTurns = activeScenario.dialogue.length;

    setIsTyping(true);
    setDialogueTurnIndex(nextIndex);

    if (hasApiKey) {
      try {
        const localeMap: Record<string, string> = {
          es: "es-ES",
          fr: "fr-FR",
          ja: "ja-JP",
        };
        const locale = localeMap[activeLangId] || "es-ES";

        const currentHistory = [
          ...messages.map((m) => ({
            sender: m.sender,
            text: m.text,
            translation: m.translation,
          })),
          {
            sender: "user" as const,
            text: textToSend.trim(),
            translation: resolvedTranslation,
          },
        ];

        const aiResponse = await fetchAIResponse(
          activeScenario.title,
          activeLanguageName,
          locale,
          currentHistory,
          textToSend.trim()
        );

        if (!isMountedRef.current) return;

        // Update user message text and translation if translated from English to target language
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === userMsgId) {
              return {
                ...msg,
                text: aiResponse.userTargetLanguageText?.trim() || msg.text,
                translation: aiResponse.userTranslation || msg.translation,
              };
            }
            return msg;
          })
        );

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: aiResponse.aiText,
            translation: aiResponse.translation,
            showTranslation: false,
          },
        ]);
        setDynamicSuggestions(aiResponse.suggestions);

        // Check if session completes (standardized to 5 turns)
        if (nextIndex >= 5) {
          setIsComplete(true);
          addXp(activeScenario.xpReward);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        }
      } catch (error) {
        console.warn("AI Generation Failed, falling back to static dialogue:", error);
        if (isMountedRef.current) fallbackToStatic(nextIndex, totalTurns);
      } finally {
        if (isMountedRef.current) setIsTyping(false);
      }
    } else {
      // Demo Mode
      demoTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return;
        fallbackToStatic(nextIndex, totalTurns);
        setIsTyping(false);
      }, 1500);
    }
  };

  // Toggle Translation
  const toggleTranslation = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, showTranslation: !msg.showTranslation } : msg
      )
    );
  };

  // Play audio using expo-speech (completely offline and free)
  const playAudio = async (id: string) => {
    try {
      Haptics.selectionAsync().catch(() => {});
      const message = messages.find((msg) => msg.id === id);
      if (!message) return;

      // Stop any current speaking first
      await Speech.stop();

      // Map target language tag to voice locale
      const localeMap: Record<string, string> = {
        es: "es-ES",
        fr: "fr-FR",
        ja: "ja-JP",
      };
      const locale = localeMap[activeLangId] || "es-ES";

      setPlayingMessageId(id);

      Speech.speak(message.text, {
        language: locale,
        onDone: () => setPlayingMessageId(null),
        onError: (err) => {
          console.warn("TTS Error:", err);
          setPlayingMessageId(null);
        },
        onStopped: () => setPlayingMessageId(null),
      });
    } catch (error) {
      console.warn("TTS Failed:", error);
      setPlayingMessageId(null);
    }
  };

  // Reset chat and return to scenarios list
  const handleExitChat = () => {
    Speech.stop().catch(() => {});
    setActiveScenario(null);
    setMessages([]);
    setIsComplete(false);
    setIsTyping(false);
    setDialogueTurnIndex(0);
  };

  // Retrieve details of the current turn
  const currentTurn = activeScenario?.dialogue[dialogueTurnIndex];
  const suggestions = hasApiKey ? dynamicSuggestions : (currentTurn?.suggestions || []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {!activeScenario ? (
        /* Scenario Selection Screen */
        <ScrollView
          style={{ flex: 1, backgroundColor: "#FFFFFF" }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[1]}
        >
          {/* Child 0: Header - scrolls normally */}
          <View className="px-6 py-6 border-b border-slate-100 items-center bg-[#F8FAFC]">
            <View className="w-16 h-16 bg-primary/10 rounded-full justify-center items-center mb-3">
              <Ionicons name="chatbubble-ellipses" size={32} color={COLORS.primary} />
            </View>
            <Text className="text-h2 text-text-primary text-center">AI Language Coach</Text>
            <Text className="text-body-md text-text-secondary text-center mt-1">
              Practice speaking real-world dialogues with Vexora, your custom AI tutor.
            </Text>

            {/* AI Status Badge */}
            <View className="flex-row items-center px-3 py-1 rounded-full border mt-3 bg-emerald-50 border-emerald-200">
              <View className={`w-2 h-2 rounded-full mr-2 ${hasApiKey ? "bg-success" : "bg-warning"}`} />
              <Text className={`text-[11px] font-extrabold uppercase tracking-wider ${hasApiKey ? "text-emerald-700" : "text-amber-700"}`}>
                {hasApiKey ? "AI Live Mode Active" : "Demo Mode (Configure .env for Live AI)"}
              </Text>
            </View>
          </View>

          {/* Child 1: Language Selector - STICKY on scroll */}
          <View className="px-6 pt-5 pb-2 bg-white">
            <Text className="text-caption font-bold text-slate-400 uppercase tracking-widest mb-3">
              Practice Path Language
            </Text>
            <View className="flex-row gap-3">
              {[
                { id: "es", name: "Spanish", flag: "https://flagcdn.com/w320/es.png" },
                { id: "fr", name: "French", flag: "https://flagcdn.com/w320/fr.png" },
                { id: "ja", name: "Japanese", flag: "https://flagcdn.com/w320/jp.png" },
              ].map((lang) => {
                const isSelected = activeLangId === lang.id;
                return (
                  <Pressable
                    key={lang.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                      setPracticeLanguageId(lang.id);
                    }}
                    className={`flex-1 flex-row items-center justify-center py-2.5 px-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <Image
                      source={lang.flag}
                      className="w-5 h-3.5 rounded-sm mr-2"
                      style={{ objectFit: "cover" }}
                    />
                    <Text
                      className={`text-body-sm font-bold ${
                        isSelected ? "text-primary font-semibold" : "text-text-secondary"
                      }`}
                    >
                      {lang.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Child 2: Scenarios List - scrolls beneath sticky header */}
          <View className="px-6 mt-4">
            <Text className="text-caption font-bold text-slate-400 uppercase tracking-widest mb-2">
              Select a conversation scenario
            </Text>
            {scenarios.map((scenario) => {
              // Custom colors per difficulty
              let diffText = "text-success";
              let diffBg = "bg-success/10";
              if (scenario.difficulty === "Easy") {
                diffText = "text-secondary";
                diffBg = "bg-secondary/10";
              } else if (scenario.difficulty === "Medium") {
                diffText = "text-streak";
                diffBg = "bg-streak/10";
              }

              return (
                <Pressable
                  key={scenario.id}
                  onPress={() => handleStartScenario(scenario)}
                  className="mt-4 p-5 rounded-[24px] bg-white border border-slate-200 border-b-[5px] border-b-slate-300 active:translate-y-0.5 active:border-b-2 flex-row items-center justify-between"
                >
                  <View className="flex-1 pr-4">
                    {/* Difficulty & XP pills */}
                    <View className="flex-row items-center gap-2 mb-2">
                      <View className={`${diffBg} px-2.5 py-0.5 rounded-md`}>
                        <Text className={`text-[10px] font-extrabold uppercase tracking-wide ${diffText}`}>
                          {scenario.difficulty}
                        </Text>
                      </View>
                      <View className="bg-amber-50 px-2.5 py-0.5 rounded-md flex-row items-center">
                        <Ionicons name="flash" size={10} color="#F59E0B" className="mr-0.5" />
                        <Text className="text-[10px] font-extrabold uppercase tracking-wide text-amber-600">
                          +{scenario.xpReward} XP
                        </Text>
                      </View>
                    </View>

                    {/* Scenario Title */}
                    <Text className="text-body-lg font-bold text-text-primary">
                      {scenario.title}
                    </Text>
                    <Text className="text-body-sm text-text-secondary mt-1">
                      Start a chat to practice speaking in {activeLanguageName}.
                    </Text>
                  </View>

                  {/* Icon Bubble */}
                  <View className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl items-center justify-center">
                    <Text className="text-3xl">{scenario.icon}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : isComplete ? (
        /* Scenario Complete / Congratulation Screen */
        <View className="flex-1 justify-between bg-white px-6 py-10">
          <View />

          <View className="items-center">
            {/* Celebratory Mascot illustration */}
            <View className="w-48 h-48 justify-center items-center relative mb-6">
              <View className="w-36 h-36 bg-amber-100 rounded-full absolute" />
              <Image
                source={images.mascotWelcome}
                className="w-32 h-40"
                style={{ objectFit: "contain" }}
              />
              <View className="absolute bottom-0 right-3 bg-amber-400 w-12 h-12 rounded-full border-4 border-white justify-center items-center shadow-md">
                <Ionicons name="star" size={24} color="white" />
              </View>
            </View>

            <Text className="text-h1 text-text-primary text-center">Excellent Chat! 🎉</Text>
            <Text className="text-body-lg text-text-secondary text-center mt-2 px-6">
              You successfully practiced the scenario <Text className="font-semibold text-text-primary">&quot;{activeScenario.title}&quot;</Text> in {activeLanguageName}!
            </Text>

            {/* Reward Card */}
            <View className="mt-8 p-6 rounded-3xl border-2 border-amber-200 bg-amber-50/50 w-full max-w-[280px] items-center justify-center border-b-4 border-b-amber-300">
              <Text className="text-caption font-bold text-amber-600 uppercase tracking-widest mb-1">
                Completed Reward
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="flash" size={32} color="#F59E0B" className="mr-1.5" />
                <Text className="text-h2 text-amber-600 font-bold">+{activeScenario.xpReward} XP</Text>
              </View>
              <Text className="text-[11px] font-bold text-slate-400 mt-2">
                New Total Progress: {xp + activeScenario.xpReward} XP
              </Text>
            </View>
          </View>

          {/* Continue button */}
          <Pressable
            onPress={handleExitChat}
            className="w-full py-4 bg-success border-b-[5px] border-b-success-dark rounded-2xl active:border-b-[2px] active:translate-y-[3px] items-center justify-center"
          >
            <Text className="text-white font-extrabold text-body-lg uppercase tracking-wider">
              Continue
            </Text>
          </Pressable>
        </View>
      ) : (
        /* Active Chat Workspace */
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        >
          {/* Header Bar */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
            {/* Back Button */}
            <Pressable
              onPress={handleExitChat}
              className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 justify-center items-center active:bg-slate-100"
            >
              <Ionicons name="chevron-back" size={20} color="#1E293B" />
            </Pressable>

            {/* AI Avatar details */}
            <View className="flex-row items-center flex-1 ml-3">
              <View className="w-10 h-10 rounded-full border border-slate-100 relative bg-indigo-50 items-center justify-center overflow-hidden">
                <Image
                  source={images.mascotWelcome}
                  className="w-9 h-11 mt-1"
                  style={{ objectFit: "contain" }}
                />
                <View className="w-2.5 h-2.5 rounded-full bg-success absolute bottom-0 right-0 border-2 border-white" />
              </View>
              <View className="ml-2">
                <Text className="text-body-md font-bold text-text-primary leading-tight">Vexora</Text>
                <Text className="text-[10px] text-text-secondary flex-row items-center leading-none">
                  {activeScenario.title} • {activeLanguageName}
                </Text>
              </View>
            </View>

            {/* Bookmark or Star Icon decoration */}
            <View className="bg-amber-100/50 border border-amber-200/50 rounded-xl px-2.5 py-1 flex-row items-center">
              <Image
                source={activeLanguageFlag}
                className="w-4 h-3 rounded-sm mr-1.5"
                style={{ objectFit: "cover" }}
              />
              <Text className="text-[10px] text-amber-700 font-extrabold uppercase">
                {activeLangId}
              </Text>
            </View>
          </View>

          {/* Progress Bar (Dynamic Turn Indicator) */}
          <View className="px-4 py-2 border-b border-slate-50">
            <View className="progress-3d-track w-full">
              <View
                className="progress-3d-fill bg-success border-r-2 border-success-dark"
                style={{ width: `${Math.min(100, (dialogueTurnIndex / activeScenario.dialogue.length) * 100)}%` }}
              >
                <View className="progress-3d-gloss" />
              </View>
            </View>
          </View>

          {/* Bubble Message Stream and Suggestions Wrapper */}
          <View style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <ScrollView
              ref={scrollViewRef}
              style={{ flex: 1, backgroundColor: "#FFFFFF" }}
              contentContainerStyle={[
                styles.chatScrollContent,
                { paddingBottom: suggestionHeight ? suggestionHeight + 20 : 20 }
              ]}
              showsVerticalScrollIndicator={false}
            >
            {messages.map((message) => {
              const isAI = message.sender === "ai";
              const isSpeakerPlaying = playingMessageId === message.id;

              return (
                <View
                  key={message.id}
                  className={`w-full my-2 flex-row ${
                    isAI ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAI && (
                    /* Inline AI Avatar circle */
                    <View className="w-8 h-8 rounded-full bg-indigo-50 border border-slate-100 items-center justify-center overflow-hidden mr-2 self-end">
                      <Image
                        source={images.mascotWelcome}
                        className="w-7 h-9 mt-1"
                        style={{ objectFit: "contain" }}
                      />
                    </View>
                  )}

                  {/* Speech Bubble */}
                  <View
                    className={`max-w-[75%] p-4 rounded-2xl ${
                      isAI
                        ? "bg-slate-100 rounded-bl-sm border border-slate-200/50"
                        : "bg-primary rounded-br-sm"
                    }`}
                  >
                    {isAI ? (
                      <View className="flex-row items-center justify-between mb-1.5 border-b border-slate-200/40 pb-1 pr-1">
                        {/* Speaker Pronunciation Action */}
                        <Pressable
                          onPress={() => playAudio(message.id)}
                          className="mr-3 flex-row items-center"
                        >
                          <Ionicons
                            name={isSpeakerPlaying ? "volume-high" : "volume-medium-outline"}
                            size={16}
                            color={isSpeakerPlaying ? COLORS.primary : COLORS.textSecondary}
                          />
                          <Text
                            className={`text-[10px] font-bold ml-1 ${
                              isSpeakerPlaying ? "text-primary" : "text-slate-400"
                            }`}
                          >
                            {isSpeakerPlaying ? "Playing..." : "Speak"}
                          </Text>
                        </Pressable>

                        {/* Translation Toggle Action */}
                        {message.translation && (
                          <Pressable
                            onPress={() => toggleTranslation(message.id)}
                            className="flex-row items-center"
                          >
                            <Ionicons
                              name="globe-outline"
                              size={12}
                              color={message.showTranslation ? COLORS.primary : COLORS.textSecondary}
                            />
                            <Text
                              className={`text-[10px] font-bold ml-0.5 ${
                                message.showTranslation ? "text-primary font-semibold" : "text-slate-400"
                              }`}
                            >
                              {message.showTranslation ? "Hide" : "Translate"}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    ) : (
                      <View className="flex-row items-center justify-between mb-1.5 border-b border-white/20 pb-1 pr-1">
                        {/* Speaker Pronunciation Action */}
                        <Pressable
                          onPress={() => playAudio(message.id)}
                          className="mr-3 flex-row items-center"
                        >
                          <Ionicons
                            name={isSpeakerPlaying ? "volume-high" : "volume-medium-outline"}
                            size={16}
                            color={isSpeakerPlaying ? "#FEF08A" : "#FFFFFF"}
                          />
                          <Text
                            className={`text-[10px] font-bold ml-1 ${
                              isSpeakerPlaying ? "text-amber-200" : "text-white/80"
                            }`}
                          >
                            {isSpeakerPlaying ? "Playing..." : "Speak"}
                          </Text>
                        </Pressable>

                        {/* Translation Toggle Action */}
                        {message.translation && (
                          <Pressable
                            onPress={() => toggleTranslation(message.id)}
                            className="flex-row items-center"
                          >
                            <Ionicons
                              name="globe-outline"
                              size={12}
                              color={message.showTranslation ? "#FEF08A" : "#FFFFFF"}
                            />
                            <Text
                              className={`text-[10px] font-bold ml-0.5 ${
                                message.showTranslation ? "text-amber-200 font-semibold" : "text-white/80"
                              }`}
                            >
                              {message.showTranslation ? "Hide" : "Translate"}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    )}

                    {/* Text Body */}
                    <Text
                      className={`text-body-md ${
                        isAI ? "text-text-primary font-medium" : "text-white font-medium"
                      }`}
                    >
                      {message.text}
                    </Text>

                    {/* Translation content */}
                    {isAI ? (
                      message.showTranslation && message.translation && (
                        <Text className="text-body-sm italic text-slate-500 mt-2 border-t border-slate-200/60 pt-1.5">
                          &quot;{message.translation}&quot;
                        </Text>
                      )
                    ) : (
                      message.showTranslation && message.translation && (
                        <Text className="text-body-sm italic text-white/90 mt-2 border-t border-white/20 pt-1.5">
                          &quot;{message.translation}&quot;
                        </Text>
                      )
                    )}
                  </View>
                </View>
              );
            })}

            {/* AI Typing Indicator */}
            {isTyping && (
              <View className="w-full my-2 flex-row justify-start">
                <View className="w-8 h-8 rounded-full bg-indigo-50 border border-slate-100 items-center justify-center overflow-hidden mr-2 self-end">
                  <Image
                    source={images.mascotWelcome}
                    className="w-7 h-9 mt-1"
                    style={{ objectFit: "contain" }}
                  />
                </View>
                <View className="bg-slate-100 rounded-2xl rounded-bl-sm border border-slate-200/50 p-4 max-w-[75%] items-center justify-center">
                  <Text className="text-body-sm font-bold text-slate-400 tracking-widest px-2">
                    Vexora is typing{typingDots}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick suggestions area */}
          <Animated.View
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              if (h > 0) setSuggestionHeight(h);
            }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              transform: [{ translateY: slideAnim }],
              backgroundColor: "#F8FAFC",
            }}
          >
            {suggestions.length > 0 && (
              <View className="border-t border-slate-100 py-3">
                <View className="px-4 mb-2 flex-row items-center justify-between">
                  <Text className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Quick Reply Suggestions
                </Text>
                <Text className="text-[9px] font-bold text-primary/70">
                  Tap to instantly send
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionScrollContent}
              >
                {suggestions.map((suggestion, idx) => (
                  <Pressable
                    key={idx}
                    onPress={() => handleSendMessage(suggestion.text)}
                    className="px-4 py-2.5 rounded-2xl border-2 border-primary/20 bg-white mr-3 active:bg-primary/5 active:border-primary/50 shadow-sm border-b-4 border-b-slate-200"
                  >
                    <Text className="text-body-sm font-semibold text-primary">
                      {suggestion.text}
                    </Text>
                    {suggestion.translation && (
                      <Text className="text-[9px] text-slate-400 italic mt-0.5">
                        {suggestion.translation}
                      </Text>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            )}
          </Animated.View>
          </View>

          {/* Bottom Chat Bar input */}
          <View className="p-4 border-t border-slate-100 bg-white flex-row items-center">
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                activeLangId === "es"
                  ? "Escribe en español..."
                  : activeLangId === "fr"
                  ? "Écrire en français..."
                  : activeLangId === "ja"
                  ? "日本語で書く..."
                  : "Type a message..."
              }
              placeholderTextColor="#94A3B8"
              className="flex-1 bg-slate-100 rounded-full px-5 py-3 text-body-md text-text-primary mr-3 border border-slate-200"
              style={styles.textInputStyle}
            />
            
            <Pressable
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className={`w-11 h-11 rounded-full items-center justify-center ${
                inputText.trim() && !isTyping
                  ? "bg-primary border-b-4 border-b-primary-dark active:border-b-0 active:translate-y-0.5"
                  : "bg-slate-200"
              }`}
            >
              <Ionicons
                name="arrow-up"
                size={22}
                color={inputText.trim() && !isTyping ? "white" : COLORS.textSecondary}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  chatScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionScrollContent: {
    paddingHorizontal: 16,
    paddingRight: 32,
  },
  textInputStyle: {
    fontSize: 14,
    color: "#0D132B",
  },
});
