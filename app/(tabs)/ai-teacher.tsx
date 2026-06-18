import React, { useState, useEffect, useRef, useCallback } from "react";
import { Animated, Platform, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { Image } from "@/components/tw/image";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useRouter, useFocusEffect } from "expo-router";

import { useAITeacherStore } from "@/store/aiTeacherStore";
import { useVoiceSession } from "@/hooks/useVoiceSession";
import { useLearningStore } from "@/store/learningStore";
import { getLanguageById } from "@/data/languages";
import { COLORS } from "@/theme/colors";
import { images } from "@/constants/images";
import { Button3D } from "@/components/Button3D";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AITeacherTab() {
  const router = useRouter();
  const {
    isSessionActive,
    sessionPhase,
    startSession,
    endSession,
    isAISpeaking,
    isRecording,
    currentRound,
    totalRounds,
    userTranscription,
    currentTranslation,
    currentTeachingText,
    currentPracticePrompt,
    aiFeedback,
    reset,
    startRecording,
    error,
    scores,
  } = useAITeacherStore();

  const { selectedLanguageId, xp, addXp } = useLearningStore();
  const [practiceLanguageId, setPracticeLanguageId] = useState<string | null>(null);
  const activeLangId = practiceLanguageId || selectedLanguageId || "es";

  const activeLanguageName = getLanguageById(activeLangId)?.name || "Spanish";
  const activeLanguageFlag = getLanguageById(activeLangId)?.flag || "https://flagcdn.com/w320/es.png";

  const { manualStopRecording } = useVoiceSession(activeLangId, activeLanguageName);

  const [hasAwardedXp, setHasAwardedXp] = useState(false);

  // Redesign state features
  const [showSubtitles, setShowSubtitles] = useState(true);



  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const mascotScale = useRef(new Animated.Value(1)).current;

  // Clean up session when tab loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        reset();
      };
    }, [reset])
  );

  // Start pulse animation based on phase
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (sessionPhase === "teaching" || sessionPhase === "feedback" || sessionPhase === "listening" || sessionPhase === "processing") {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: sessionPhase === "processing" ? 1.05 : 1.12,
            duration: sessionPhase === "processing" ? 1000 : 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: sessionPhase === "processing" ? 1000 : 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [sessionPhase, pulseAnim]);

  // Mascot bounce on phase change
  useEffect(() => {
    if (sessionPhase === "teaching" || sessionPhase === "feedback") {
      Animated.sequence([
        Animated.timing(mascotScale, { toValue: 1.06, duration: 180, useNativeDriver: true }),
        Animated.timing(mascotScale, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [sessionPhase, mascotScale]);

  // Speech bubble fade in/out
  useEffect(() => {
    const shouldShow = !!error || sessionPhase === "teaching" || sessionPhase === "feedback" || sessionPhase === "processing" || sessionPhase === "listening";
    Animated.timing(bubbleOpacity, {
      toValue: shouldShow ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [sessionPhase, error, bubbleOpacity]);



  // Handle completion XP
  useEffect(() => {
    if (sessionPhase === "complete" && !hasAwardedXp) {
      const failedCount = scores.filter(score => score < 60).length;
      let xpAward = 0;
      if (failedCount === 0) {
        xpAward = 30;
      } else if (failedCount === 1) {
        xpAward = 15;
      } else {
        xpAward = 0;
      }

      if (xpAward > 0) {
        addXp(xpAward);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      }
      setHasAwardedXp(true);
    }
  }, [sessionPhase, hasAwardedXp, addXp, scores]);

  const handleExit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    reset();
    router.replace("/learn");
  };

  const handleStartCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setHasAwardedXp(false);
    startSession(activeLanguageName, activeLangId);
  };

  const handleEndCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    reset();
  };

  const getTargetSpeechLang = () => {
    switch (activeLangId.toLowerCase()) {
      case "es": return "es-ES";
      case "fr": return "fr-FR";
      case "ja": return "ja-JP";
      case "de": return "de-DE";
      case "it": return "it-IT";
      case "pt": return "pt-BR";
      case "ko": return "ko-KR";
      case "zh": return "zh-CN";
      default: return activeLangId;
    }
  };

  const handleSpeakerPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    
    try {
      await Speech.stop();
      
      if (sessionPhase === "feedback") {
        // Feedback is in English
        Speech.speak(aiFeedback || "", { language: "en-US", rate: 0.85 });
      } else if (sessionPhase === "listening") {
        // During listening, replay the target language phrase
        Speech.speak(currentPracticePrompt || "", {
          language: getTargetSpeechLang(),
          rate: 0.8,
        });
      } else {
        // Teaching phase: speak English explanation, then target phrase
        if (currentTeachingText) {
          Speech.speak(currentTeachingText, {
            language: "en-US",
            rate: 0.85,
            onDone: () => {
              if (currentPracticePrompt) {
                Speech.speak(currentPracticePrompt, {
                  language: getTargetSpeechLang(),
                  rate: 0.8,
                });
              }
            },
          });
        } else if (currentPracticePrompt) {
          Speech.speak(currentPracticePrompt, {
            language: getTargetSpeechLang(),
            rate: 0.8,
          });
        }
      }
    } catch (e) {
      console.warn("TTS replay failed:", e);
    }
  };

  // Build content strings for bubble text
  const getSpeechBubbleHeader = (): string => {
    if (error) return "Oops! Error processing audio";
    if (sessionPhase === "teaching") return currentTeachingText || "Let's practice!";
    if (sessionPhase === "feedback") return aiFeedback || "Keep it up!";
    // During listening, show the target language phrase they need to say
    if (sessionPhase === "listening") return currentPracticePrompt || "Speak now!";
    if (sessionPhase === "processing") return userTranscription ? `"${userTranscription}"` : "Transcribing...";
    return "";
  };

  const getSpeechBubbleSubtitle = (): string => {
    if (error) return error;
    // During teaching: show the practice prompt (target language phrase) below the explanation
    if (sessionPhase === "teaching") return currentPracticePrompt ? `🗣️ Say: "${currentPracticePrompt}"` : "";
    if (sessionPhase === "feedback") return "";
    if (sessionPhase === "listening") return isRecording ? "I'm listening, speak now..." : "Tap the Mic to answer!";
    if (sessionPhase === "processing") return "Analyzing pronunciation...";
    return "";
  };

  // Translation text (shown when translate button is toggled on)
  const getTranslationText = (): string => {
    return currentTranslation || "";
  };

  const getMascotImage = () => {
    if (!isSessionActive) {
      return images.mascotWelcome;
    }
    if (sessionPhase === "teaching" || sessionPhase === "listening" || sessionPhase === "processing") {
      return images.mascotTeacher;
    }
    if (sessionPhase === "feedback") {
      const latestScore = scores.length > 0 ? scores[scores.length - 1] : 0;
      if (latestScore >= 60) {
        return images.mascotWelcome;
      } else if (latestScore >= 31) {
        return images.mascotSadLittle;
      } else {
        return images.mascotSadCompletely;
      }
    }
    return images.mascotWelcome;
  };



  // ─── 2. COMPLETE STATE ─────────────────────────────────────────────────
  if (sessionPhase === "complete") {
    const failedCount = scores.filter(score => score < 60).length;
    const isPassed = failedCount <= 1;

    let mascotSource = images.mascotWelcome;
    let xpAmount = 30;
    if (failedCount === 1) {
      mascotSource = images.mascotSadLittle;
      xpAmount = 15;
    } else if (failedCount > 1) {
      mascotSource = images.mascotSadCompletely;
      xpAmount = 0;
    }

    const passedCount = scores.filter(s => s >= 60).length;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-1 justify-center items-center px-6 py-12 bg-white">
          <Image
            source={mascotSource}
            style={{ width: 192, height: 192, marginBottom: 32, objectFit: "contain" }}
          />
          <Text className="text-[28px] font-extrabold text-slate-800 text-center mb-2">
            {isPassed ? "Lesson Completed!" : "Keep Practicing!"}
          </Text>
          <Text className="text-body-lg text-slate-500 text-center mb-8 px-4">
            You passed {passedCount} out of {totalRounds} rounds in {activeLanguageName}!
          </Text>

          <View className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-row justify-around mb-12">
            <View className="items-center">
              <Text className="text-body-sm font-bold text-slate-400 uppercase">Reward</Text>
              <Text className="text-h3 font-extrabold text-amber-500">+{xpAmount} XP</Text>
            </View>
            <View className="items-center">
              <Text className="text-body-sm font-bold text-slate-400 uppercase">Rounds</Text>
              <Text className="text-h3 font-extrabold text-success">{passedCount} / {totalRounds}</Text>
            </View>
          </View>

          {!isPassed && (
            <View className="w-full mb-3">
              <Button3D
                variant="primary"
                size="lg"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                  setHasAwardedXp(false);
                  startSession(activeLanguageName, activeLangId);
                }}
              >
                RETRY LESSON
              </Button3D>
            </View>
          )}
          <Button3D variant="success" size="lg" onPress={handleExit}>
            {isPassed ? "CONTINUE" : "EXIT"}
          </Button3D>
        </View>
      </SafeAreaView>
    );
  }

  // ─── 3. ACTIVE SESSION STATE ───────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* ───── Header Bar ───── */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white">
        {/* Left: Back + Title */}
        <View className="flex-row items-center">
          <Pressable
            onPress={handleExit}
            className="w-10 h-10 items-center justify-center mr-1"
          >
            <Ionicons name="chevron-back" size={26} color={COLORS.textPrimary} />
          </Pressable>
          <View>
            <Text className="text-body-lg font-extrabold text-text-primary">AI Teacher</Text>
            <View className="flex-row items-center">
              <Text className="text-xs font-bold text-success">● Online</Text>
            </View>
          </View>
        </View>

        {/* Right: Round Info and Buttons */}
        <View className="flex-row items-center gap-2">
          {/* Round counter styled exactly like the '12' pill in the design */}
          <View className="px-3.5 h-10 rounded-full border border-slate-200 items-center justify-center bg-white">
            <Text className="text-body-sm font-extrabold text-text-primary">
              {currentRound}/{totalRounds}
            </Text>
          </View>

          {/* Profile icon representation */}
          <View className="w-10 h-10 rounded-full border border-slate-200 items-center justify-center bg-white">
            <Ionicons name="person-outline" size={18} color="#1E293B" />
          </View>
        </View>
      </View>

      {/* ───── Main cozy background Card ───── */}
      <View className="flex-1 px-4 mt-2 mb-1">
        <View className="flex-1 rounded-[32px] overflow-hidden border border-slate-200/50 shadow-sm relative">
          
          {/* Living room cozy background */}
          <Image
            source={images.roomBg}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover" }}
          />

          {/* Mascot in center waving */}
          <View className="flex-1 justify-center items-center pb-20">
            <Animated.View style={{ transform: [{ scale: mascotScale }] }}>
              <Image
                source={getMascotImage()}
                className="w-140 h-140"
                style={{ objectFit: "contain" }}
              />
            </Animated.View>
          </View>

          {/* Floating Speech Bubble */}
          <Animated.View
            style={[
              styles.speechBubbleContainer,
              { opacity: bubbleOpacity },
            ]}
            pointerEvents={error || sessionPhase === "teaching" || sessionPhase === "feedback" || sessionPhase === "processing" || sessionPhase === "listening" ? "auto" : "none"}
          >
            <View className={`bg-white rounded-3xl p-5 shadow-lg border relative ${error ? "border-rose-200" : "border-slate-100"}`}>
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  {/* Native phrase / instruction */}
                  <Text className={`text-body-lg font-bold leading-snug ${error ? "text-rose-600" : "text-text-primary"}`}>
                    {getSpeechBubbleHeader()}
                  </Text>
                  
                  {/* Subtitle - practice prompt or status */}
                  {getSpeechBubbleSubtitle() ? (
                    <Text className="text-body-sm text-text-secondary mt-1 font-medium leading-normal">
                      {getSpeechBubbleSubtitle()}
                    </Text>
                  ) : null}

                  {/* Translation toggle - shows target language version */}
                  {showSubtitles && getTranslationText() ? (
                    <View className="mt-2 pt-2 border-t border-slate-100">
                      <Text className="text-body-sm text-primary font-medium leading-normal italic">
                        {getTranslationText()}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Replay voice button or error icon */}
                {error ? (
                  <View className="w-10 h-10 rounded-full bg-rose-50 items-center justify-center">
                    <Ionicons name="alert-circle" size={22} color="#E11D48" />
                  </View>
                ) : (
                  <Pressable
                    onPress={handleSpeakerPress}
                    className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center active:bg-indigo-100"
                  >
                    <Ionicons name="volume-high" size={20} color={COLORS.primary} />
                  </Pressable>
                )}
              </View>

              {/* Triangle speech bubble tail pointer */}
              <View style={[styles.bubbleTail, error && { borderTopColor: "#FFE4E6" }]} />
            </View>
          </Animated.View>

        </View>
      </View>

      {/* ───── Bottom Action Control Buttons ───── */}
      <View className="px-6 pt-2 pb-5 bg-white -mt-4">
        <View className="flex-row justify-around items-center mb-3">
          {/* Microphone toggle / Action */}
          <View className="items-center">
            {sessionPhase === "listening" ? (
              isRecording ? (
                <Animated.View
                  style={{
                    transform: [{ scale: pulseAnim }],
                  }}
                >
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                      manualStopRecording();
                    }}
                    style={styles.circleBtn}
                    className="bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20 active:bg-emerald-600"
                  >
                    <Ionicons name="mic" size={22} color="white" />
                  </Pressable>
                </Animated.View>
              ) : (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                    startRecording();
                  }}
                  style={styles.circleBtn}
                  className="bg-emerald-50 border-2 border-emerald-400 active:bg-emerald-100"
                >
                  <Ionicons name="mic-outline" size={22} color={COLORS.success} />
                </Pressable>
              )
            ) : (
              <Pressable
                style={styles.circleBtn}
                className="bg-white border border-slate-200 opacity-60"
                disabled={true}
              >
                <Ionicons name="mic-off" size={22} color="#94A3B8" />
              </Pressable>
            )}
            <Text className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
              {sessionPhase === "listening" ? (isRecording ? "Listening" : "Speak") : "Mic"}
            </Text>
          </View>

          {/* Translate toggle */}
          <View className="items-center">
            <Pressable
              onPress={() => {
                if (!isSessionActive) return;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                setShowSubtitles((prev) => !prev);
              }}
              style={styles.circleBtn}
              className={`border border-slate-200 active:bg-slate-50 ${
                !isSessionActive 
                  ? "bg-white opacity-60" 
                  : showSubtitles 
                    ? "bg-indigo-50 border-primary/20" 
                    : "bg-white"
              }`}
              disabled={!isSessionActive}
            >
              <MaterialIcons
                name="translate"
                size={22}
                color={!isSessionActive ? "#94A3B8" : showSubtitles ? COLORS.primary : "#1E293B"}
              />
            </Pressable>
            <Text className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
              {activeLanguageName}
            </Text>
          </View>

          {/* Call/End Call button */}
          <View className="items-center">
            {isSessionActive ? (
              <>
                <Pressable
                  onPress={handleEndCall}
                  style={styles.circleBtnEnd}
                  className="bg-rose-500 border-rose-500 shadow-md shadow-rose-500/20 active:bg-rose-600 active:border-rose-600"
                >
                  <MaterialCommunityIcons name="phone-hangup" size={22} color="white" />
                </Pressable>
                <Text className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
                  End Call
                </Text>
              </>
            ) : (
              <>
                <Pressable
                  onPress={handleStartCall}
                  style={styles.circleBtnEnd}
                  className="bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/20 active:bg-emerald-600 active:border-emerald-600"
                >
                  <MaterialCommunityIcons name="phone" size={22} color="white" />
                </Pressable>
                <Text className="text-[11px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">
                  Call
                </Text>
              </>
            )}
          </View>
        </View>


      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  speechBubbleContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 30,
  },
  bubbleTail: {
    position: "absolute",
    bottom: -10,
    left: "50%",
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FFFFFF",
  },
  circleBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  circleBtnEnd: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
