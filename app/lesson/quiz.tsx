import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/components/tw";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getQuizById } from "@/data/quizzes";
import { useQuizStore } from "@/store/quizStore";
import { useLearningStore } from "@/store/learningStore";
import { Button3D } from "@/components/Button3D";
import { Image } from "@/components/tw/image";
import { images } from "@/constants/images";
import * as Haptics from "expo-haptics";

export default function QuizScreen() {
  const router = useRouter();
  const { quizId } = useLocalSearchParams<{ quizId: string }>();

  const quiz = quizId ? getQuizById(quizId) : null;
  const { completeQuiz } = useLearningStore();
  const {
    activeQuiz,
    currentQuestionIndex,
    score,
    isFinished,
    startQuiz,
    nextQuestion,
    incrementScore,
    resetQuiz,
  } = useQuizStore();

  // Local state for question answering state machine
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Matching pairs specific states
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // format: ["left:right"]
  const [failedMatch, setFailedMatch] = useState<{ left: string; right: string } | null>(null);

  const currentQuestionSafe = activeQuiz ? activeQuiz.questions[currentQuestionIndex] : null;

  const { shuffledLeft, shuffledRight } = React.useMemo(() => {
    if (currentQuestionSafe?.type === "MATCH_PAIRS" && currentQuestionSafe.pairs) {
      return {
        shuffledLeft: [...currentQuestionSafe.pairs.map((p) => p.left)].sort(() => Math.random() - 0.5),
        shuffledRight: [...currentQuestionSafe.pairs.map((p) => p.right)].sort(() => Math.random() - 0.5),
      };
    }
    return { shuffledLeft: [], shuffledRight: [] };
  }, [currentQuestionSafe]);

  useEffect(() => {
    if (quiz) {
      startQuiz(quiz);
      resetQuestionStates();
    }
    return () => {
      resetQuiz();
    };
  }, [quizId, quiz, startQuiz, resetQuiz]);

  const resetQuestionStates = () => {
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(null);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setFailedMatch(null);
  };

  if (!quiz || !activeQuiz) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-h3 font-extrabold text-slate-800 text-center mb-4">Quiz not found</Text>
          <Button3D onPress={() => router.back()}>Go Back</Button3D>
        </View>
      </SafeAreaView>
    );
  }

  const questions = activeQuiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = (currentQuestionIndex / questions.length) * 100;

  const handleLeftSelect = (leftVal: string) => {
    if (isChecked) return;
    const existingMatch = matchedPairs.find((p) => p.startsWith(`${leftVal}:`));
    if (existingMatch) {
      // Un-match if already matched
      setMatchedPairs((prev) => prev.filter((p) => p !== existingMatch));
      return;
    }
    setSelectedLeft(leftVal);
    setFailedMatch(null);

    // If a right element is already selected, verify match
    if (selectedRight) {
      checkPair(leftVal, selectedRight);
    }
  };

  const handleRightSelect = (rightVal: string) => {
    if (isChecked) return;
    const existingMatch = matchedPairs.find((p) => p.endsWith(`:${rightVal}`));
    if (existingMatch) {
      // Un-match if already matched
      setMatchedPairs((prev) => prev.filter((p) => p !== existingMatch));
      return;
    }
    setSelectedRight(rightVal);
    setFailedMatch(null);

    // If a left element is already selected, verify match
    if (selectedLeft) {
      checkPair(selectedLeft, rightVal);
    }
  };

  const checkPair = (left: string, right: string) => {
    const pairStr = `${left}:${right}`;
    setMatchedPairs((prev) => [...prev, pairStr]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleCheckAnswer = () => {
    if (isChecked) return;

    let correct = false;
    if (currentQuestion.type === "MULTIPLE_CHOICE" || currentQuestion.type === "FILL_BLANK") {
      correct = selectedOption === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "MATCH_PAIRS") {
      correct = matchedPairs.every((pair) => (currentQuestion.correctAnswer as string[]).includes(pair));
    }

    setIsCorrect(correct);
    setIsChecked(true);

    if (correct) {
      incrementScore();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
  };

  const handleContinue = () => {
    if (currentQuestionIndex < questions.length - 1) {
      nextQuestion();
      resetQuestionStates();
    } else {
      // Completed the quiz!
      const earnedXp = Math.max(0, Math.floor(activeQuiz.xpReward * (score / questions.length)));
      const percentage = Math.round((score / questions.length) * 100);
      completeQuiz(activeQuiz.id, earnedXp, percentage);
      useQuizStore.setState({ isFinished: true });
    }
  };

  // Check if check button should be enabled
  const isCheckEnabled = () => {
    if (isChecked) return false;
    if (currentQuestion.type === "MULTIPLE_CHOICE" || currentQuestion.type === "FILL_BLANK") {
      return selectedOption !== null;
    }
    if (currentQuestion.type === "MATCH_PAIRS") {
      return matchedPairs.length === (currentQuestion.correctAnswer as string[]).length;
    }
    return false;
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const finalXp = Math.max(0, Math.floor(activeQuiz.xpReward * (score / questions.length)));
    
    let mascotSource = images.mascotWelcome;
    if (finalXp < 10) {
      mascotSource = images.mascotSadCompletely;
    } else if (finalXp < 15) {
      mascotSource = images.mascotSadLittle;
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 justify-center items-center px-6 py-12 bg-white">
          <Image
            source={mascotSource}
            style={{ width: 192, height: 192, marginBottom: 32, objectFit: "contain" }}
          />
          <Text className="text-[28px] font-extrabold text-slate-800 text-center mb-2">
            Quiz Completed!
          </Text>
          <Text className="text-body-lg text-slate-500 text-center mb-8 px-4">
            You scored {score} out of {questions.length} ({percentage}%)!
          </Text>

          <View className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-row justify-around mb-12">
            <View className="items-center">
              <Text className="text-body-sm font-bold text-slate-400 uppercase">XP Gained</Text>
              <Text className="text-h3 font-extrabold text-amber-500">+{finalXp} XP</Text>
            </View>
            <View className="items-center">
              <Text className="text-body-sm font-bold text-slate-400 uppercase">Correct</Text>
              <Text className="text-h3 font-extrabold text-success">{score} / {questions.length}</Text>
            </View>
          </View>

          <Button3D variant="success" size="lg" onPress={() => router.replace("/(tabs)/learn")}>
            CONTINUE
          </Button3D>
        </View>
      </SafeAreaView>
    );
  }

  // Render question component by type
  const renderQuestionBody = () => {
    switch (currentQuestion.type) {
      case "MULTIPLE_CHOICE":
        return (
          <View className="w-full">
            <Text className="text-[22px] font-extrabold text-slate-850 mb-6 px-2">
              {currentQuestion.question}
            </Text>
            {currentQuestion.options?.map((option) => {
              const isSelected = selectedOption === option;
              const isOptionCorrect = option === currentQuestion.correctAnswer;
              
              // Colors when checked
              let borderCol = "border-slate-200";
              let bgCol = "bg-white";
              let textCol = "text-slate-700";

              if (isSelected) {
                borderCol = "border-primary";
                bgCol = "bg-primary/5";
                textCol = "text-primary";
              }

              if (isChecked) {
                if (isOptionCorrect) {
                  borderCol = "border-success";
                  bgCol = "bg-success/5";
                  textCol = "text-success";
                } else if (isSelected) {
                  borderCol = "border-error";
                  bgCol = "bg-error/5";
                  textCol = "text-error";
                }
              }

              return (
                <Pressable
                  key={option}
                  disabled={isChecked}
                  onPress={() => setSelectedOption(option)}
                  className={`w-full py-4 px-6 rounded-2xl border-2 ${borderCol} ${bgCol} mb-4 flex-row items-center active:bg-slate-50`}
                  style={{
                    borderBottomWidth: 4,
                  }}
                >
                  <View
                    className={`w-7 h-7 rounded-full border-2 ${
                      isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white"
                    } items-center justify-center mr-4`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </View>
                  <Text className={`text-body-lg font-extrabold ${textCol}`}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        );

      case "FILL_BLANK":
        // Extract prompt and render input
        const parts = currentQuestion.sentenceWithBlank?.split("_____") || ["", ""];
        return (
          <View className="w-full">
            <Text className="text-[22px] font-extrabold text-slate-850 mb-6 px-2">
              {currentQuestion.question}
            </Text>

            {/* Sentence card */}
            <View className="w-full bg-white border border-slate-200 rounded-3xl p-6 mb-8 flex-row flex-wrap items-center justify-center min-h-[100px]">
              <Text className="text-[24px] font-extrabold text-slate-800">
                {parts[0]}
              </Text>
              <View className="mx-2 px-6 py-2 border-b-4 border-slate-300 min-w-[120px] bg-slate-50 rounded-xl items-center justify-center">
                <Text className="text-[24px] font-black text-primary">
                  {selectedOption || " "}
                </Text>
              </View>
              <Text className="text-[24px] font-extrabold text-slate-800">
                {parts[1]}
              </Text>
            </View>

            {/* Word choices */}
            <View className="flex-row flex-wrap justify-center px-2">
              {currentQuestion.options?.map((option) => {
                const isUsed = selectedOption === option;
                return (
                  <Pressable
                    key={option}
                    disabled={isChecked}
                    onPress={() => setSelectedOption(option)}
                    className={`mx-2 my-2 py-3 px-6 rounded-2xl border-2 ${
                      isUsed ? "border-slate-100 bg-slate-100" : "border-slate-200 bg-white active:bg-slate-50"
                    }`}
                    style={{
                      borderBottomWidth: isUsed ? 2 : 4,
                    }}
                  >
                    <Text className={`text-body-md font-bold ${isUsed ? "text-slate-400" : "text-slate-700"}`}>
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        );

      case "MATCH_PAIRS":
        // Extract left and right items
        const leftItems = shuffledLeft;
        const rightItems = shuffledRight;

        return (
          <View className="w-full">
            <Text className="text-[22px] font-extrabold text-slate-850 mb-6 px-2">
              {currentQuestion.question}
            </Text>

            <View className="flex-row justify-between w-full px-2">
              {/* Left Column */}
              <View className="w-[47%]">
                {leftItems.map((leftVal) => {
                  const isMatched = matchedPairs.some((p) => p.startsWith(`${leftVal}:`));
                  const isSelected = selectedLeft === leftVal;
                  const isFailed = failedMatch?.left === leftVal;

                  let borderCol = "border-slate-200";
                  let bgCol = "bg-white";
                  let textCol = "text-slate-700";

                  if (isMatched) {
                    const isWrongMatch = isChecked && !(currentQuestion.correctAnswer as string[]).includes(matchedPairs.find(p => p.startsWith(`${leftVal}:`))!);
                    
                    if (isWrongMatch) {
                      borderCol = "border-error bg-error/5";
                      textCol = "text-error line-through";
                    } else if (isChecked) {
                      borderCol = "border-success bg-success/5";
                      textCol = "text-success line-through";
                    } else {
                      borderCol = "border-primary bg-primary/5";
                      textCol = "text-primary";
                    }
                  } else if (isSelected) {
                    borderCol = "border-primary bg-primary/5";
                    textCol = "text-primary";
                  } else if (isFailed) {
                    borderCol = "border-error bg-error/5";
                    textCol = "text-error";
                  }

                  return (
                    <Pressable
                      key={leftVal}
                      disabled={isMatched || isChecked}
                      onPress={() => handleLeftSelect(leftVal)}
                      className={`w-full py-4 px-4 rounded-xl border-2 ${borderCol} ${bgCol} mb-4 items-center`}
                      style={{ borderBottomWidth: isMatched ? 2 : 4 }}
                    >
                      <Text className={`text-body-md font-extrabold ${textCol}`}>
                        {leftVal}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Right Column */}
              <View className="w-[47%]">
                {rightItems.map((rightVal) => {
                  const isMatched = matchedPairs.some((p) => p.endsWith(`:${rightVal}`));
                  const isSelected = selectedRight === rightVal;
                  const isFailed = failedMatch?.right === rightVal;

                  let borderCol = "border-slate-200";
                  let bgCol = "bg-white";
                  let textCol = "text-slate-700";

                  if (isMatched) {
                    const isWrongMatch = isChecked && !(currentQuestion.correctAnswer as string[]).includes(matchedPairs.find(p => p.endsWith(`:${rightVal}`))!);
                    
                    if (isWrongMatch) {
                      borderCol = "border-error bg-error/5";
                      textCol = "text-error line-through";
                    } else if (isChecked) {
                      borderCol = "border-success bg-success/5";
                      textCol = "text-success line-through";
                    } else {
                      borderCol = "border-primary bg-primary/5";
                      textCol = "text-primary";
                    }
                  } else if (isSelected) {
                    borderCol = "border-primary bg-primary/5";
                    textCol = "text-primary";
                  } else if (isFailed) {
                    borderCol = "border-error bg-error/5";
                    textCol = "text-error";
                  }

                  return (
                    <Pressable
                      key={rightVal}
                      disabled={isMatched || isChecked}
                      onPress={() => handleRightSelect(rightVal)}
                      className={`w-full py-4 px-4 rounded-xl border-2 ${borderCol} ${bgCol} mb-4 items-center`}
                      style={{ borderBottomWidth: isMatched ? 2 : 4 }}
                    >
                      <Text className={`text-body-md font-extrabold ${textCol}`}>
                        {rightVal}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full border border-slate-200 justify-center items-center active:bg-slate-100"
        >
          <Ionicons name="close" size={20} color="#64748B" />
        </Pressable>

        {/* Dynamic Progress Bar */}
        <View className="flex-1 mx-4 h-[16px] bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative justify-center">
          <View
            style={{ width: `${progressPercent}%` }}
            className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
          />
          <View
            style={{ width: `${progressPercent}%` }}
            className="absolute left-0 top-0 h-[6px] bg-white/20 rounded-full"
          />
        </View>

        <View className="flex-row items-center">
          <Ionicons name="flash" size={18} color="#F59E0B" />
          <Text className="text-[14px] font-extrabold text-amber-500 ml-1">
            +{activeQuiz.xpReward} XP
          </Text>
        </View>
      </View>

      {/* Question Content ScrollView */}
      <ScrollView
        style={styles.scrollStyle}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderQuestionBody()}
      </ScrollView>

      {/* Feedback Banner / Action Button Footer */}
      {isChecked ? (
        <View
          className={`px-6 pt-6 pb-8 border-t ${
            isCorrect ? "bg-success-dark/10 border-success/20" : "bg-error-dark/10 border-error/20"
          }`}
        >
          <View className="flex-row items-start mb-4">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center mr-3 mt-0.5 ${
                isCorrect ? "bg-success" : "bg-error"
              }`}
            >
              <Ionicons
                name={isCorrect ? "checkmark" : "alert-circle"}
                size={20}
                color="white"
              />
            </View>
            <View className="flex-1">
              <Text className={`text-[18px] font-black ${isCorrect ? "text-success" : "text-error"}`}>
                {isCorrect ? "Excellent!" : "Correct Answer:"}
              </Text>
              <Text className="text-body-sm font-semibold text-slate-650 mt-1">
                {isCorrect
                  ? "Well done, you selected the correct option!"
                  : `Should be: ${
                      Array.isArray(currentQuestion.correctAnswer)
                        ? "All pairs completed successfully"
                        : currentQuestion.correctAnswer
                    }`}
              </Text>
              {currentQuestion.explanation && (
                <Text className="text-body-xs font-semibold text-slate-500 mt-2 italic">
                  💡 {currentQuestion.explanation}
                </Text>
              )}
            </View>
          </View>
          <Button3D
            variant={isCorrect ? "success" : "danger"}
            size="lg"
            onPress={handleContinue}
          >
            CONTINUE
          </Button3D>
        </View>
      ) : (
        <View className="px-6 py-6 border-t border-slate-100 bg-white">
          <Button3D
            disabled={!isCheckEnabled()}
            variant={isCheckEnabled() ? "success" : "outline"}
            size="lg"
            onPress={handleCheckAnswer}
          >
            CHECK
          </Button3D>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollStyle: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
});
