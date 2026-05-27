import React from "react";
import { Modal, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { Ionicons } from "@expo/vector-icons";
import { Button3D } from "@/components/Button3D";
import { COLORS } from "@/theme/colors";
import { Flashcard } from "@/data/flashcardLessons";
import { PronunciationResult } from "@/store/pronunciationStore";

interface PracticeModalProps {
  activePracticeCard: Flashcard | null;
  isRecording: boolean;
  isEvaluating: boolean;
  evaluationResult: PronunciationResult | null;
  speechError: string | null;
  onClose: () => void;
  onToggleRecording: () => void;
  onPlayAudio: (text: string) => void;
}

export function PracticeModal({
  activePracticeCard,
  isRecording,
  isEvaluating,
  evaluationResult,
  speechError,
  onClose,
  onToggleRecording,
  onPlayAudio,
}: PracticeModalProps) {
  return (
    <Modal
      visible={activePracticeCard !== null}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-slate-100">
          <Pressable
            onPress={onClose}
            className="w-10 h-10 rounded-full border border-slate-200 justify-center items-center active:bg-slate-100"
          >
            <Ionicons name="close" size={20} color="#64748B" />
          </Pressable>
          <Text className="text-body-lg font-extrabold text-slate-800">
            AI Speech Practice
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-6 justify-center items-center">
          <Text className="text-body-sm font-black uppercase tracking-widest text-slate-400 mb-2">
            Practice saying:
          </Text>

          {activePracticeCard && (
            <View className="items-center mb-8 px-4">
              <Text className="text-[34px] font-bold text-slate-800 text-center">
                {activePracticeCard.text}
              </Text>
              {activePracticeCard.pronunciation && (
                <Text className="text-body-lg text-slate-400 font-bold mt-2 italic text-center">
                  {"\"" + activePracticeCard.pronunciation + "\""}
                </Text>
              )}

              <Pressable
                onPress={() => onPlayAudio(activePracticeCard.text)}
                className="mt-4 flex-row items-center gap-1.5 bg-primary/10 px-4 py-2 rounded-full active:bg-primary/20 border border-primary/20"
              >
                <Ionicons name="volume-high" size={18} color={COLORS.primary} />
                <Text className="text-body-sm font-extrabold text-primary">Listen to Audio</Text>
              </Pressable>
            </View>
          )}

          <View className="w-full min-h-[160px] justify-center items-center mb-10">
            {isEvaluating ? (
              <View key="evaluating" className="items-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-body-md font-bold text-slate-500 mt-4">
                  AI is grading your accent...
                </Text>
              </View>
            ) : evaluationResult ? (
              <View key="result" className="w-full bg-slate-50 rounded-3xl p-6 border border-slate-100 items-center">
                <View className="flex-row items-center gap-2 mb-3">
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center border-2 ${
                      evaluationResult.score >= 70
                        ? "bg-success/15 border-success"
                        : "bg-error/15 border-error"
                    }`}
                  >
                    <Text
                      className={`text-body-lg font-black ${
                        evaluationResult.score >= 70 ? "text-success" : "text-error"
                      }`}
                    >
                      {evaluationResult.score}
                    </Text>
                  </View>
                  <Text className="text-body-md font-black text-slate-700">
                    Accent Score
                  </Text>
                </View>

                <Text className="text-body-sm text-slate-400 font-bold mb-1">What we heard:</Text>
                <Text className="text-body-md text-slate-800 font-extrabold text-center italic mb-4">
                  {"\"" + (evaluationResult.transcription || "...") + "\""}
                </Text>

                <Text className="text-body-sm font-semibold text-slate-600 text-center px-2">
                  {evaluationResult.feedback}
                </Text>
              </View>
            ) : speechError ? (
              <View key="error" className="w-full bg-error/10 rounded-2xl p-5 border border-error/20 items-center">
                <Ionicons name="alert-circle" size={24} color={COLORS.error} />
                <Text className="text-body-sm font-bold text-error text-center mt-2">
                  {speechError}
                </Text>
              </View>
            ) : (
              <Text key="idle" className="text-body-md text-slate-400 font-bold text-center px-8">
                {isRecording ? "Listening... Tap the red button to finish and evaluate." : "Tap the red microphone button below, then speak clearly into your device."}
              </Text>
            )}
          </View>

          {isRecording && (
            <View className="flex-row gap-1 justify-center items-center h-8 mb-6">
              {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((scale, i) => (
                <View
                  key={i}
                  style={{ height: scale * 4 }}
                  className="w-1.5 bg-error rounded-full"
                />
              ))}
            </View>
          )}

          <Pressable
            onPress={onToggleRecording}
            disabled={isEvaluating}
            className={`w-24 h-24 rounded-full justify-center items-center border-4 ${
              isRecording
                ? "bg-error/25 border-error/50 active:bg-error/35"
                : "bg-error border-error-dark/20 active:bg-red-600"
            } shadow-lg`}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={40}
              color={isRecording ? COLORS.error : "white"}
            />
          </Pressable>
          <Text className="text-body-sm font-black text-slate-500 uppercase tracking-widest mt-4">
            {isRecording ? "TAP TO STOP" : "TAP TO RECORD"}
          </Text>
        </View>

        <View className="px-6 py-6 border-t border-slate-100 bg-white">
          {evaluationResult ? (
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Button3D variant="outline" size="lg" onPress={onToggleRecording}>
                  TRY AGAIN
                </Button3D>
              </View>
              <View className="flex-1">
                <Button3D variant="success" size="lg" onPress={onClose}>
                  GOT IT
                </Button3D>
              </View>
            </View>
          ) : (
            <Button3D variant="outline" size="lg" onPress={onClose}>
              CANCEL
            </Button3D>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
