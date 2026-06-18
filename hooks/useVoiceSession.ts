import { useEffect, useRef } from "react";
import * as Speech from "expo-speech";
import { useAITeacherStore } from "@/store/aiTeacherStore";

export function useVoiceSession(languageCode: string, languageName: string) {
  const {
    sessionPhase,
    setPhase,
    setIsAISpeaking,
    currentTeachingText,
    currentPracticePrompt,
    aiFeedback,
    stopRecordingAndProcess,
    currentRound,
    totalRounds,
    nextRound,
  } = useAITeacherStore();

  const activeSpeechId = useRef(0);
  const lastSpokenKey = useRef<string | null>(null);

  // Keep refs always in sync so TTS closures never read stale language values
  const languageCodeRef = useRef(languageCode);
  const languageNameRef = useRef(languageName);
  useEffect(() => {
    languageCodeRef.current = languageCode;
    languageNameRef.current = languageName;
  }, [languageCode, languageName]);

  /** Map short language codes to BCP-47 for expo-speech */
  const getTargetLangCode = (code: string) => {
    switch (code.toLowerCase()) {
      case "es": return "es-ES";
      case "fr": return "fr-FR";
      case "ja": return "ja-JP";
      case "de": return "de-DE";
      case "it": return "it-IT";
      case "pt": return "pt-BR";
      case "ko": return "ko-KR";
      case "zh": return "zh-CN";
      default: return code;
    }
  };

  /** Speak text in English */
  const speakEnglish = (text: string, onDone?: () => void) => {
    const currentId = activeSpeechId.current;
    Speech.speak(text, {
      language: "en-US",
      rate: 0.85,
      onDone: () => {
        if (currentId !== activeSpeechId.current) return;
        onDone?.();
      },
      onError: () => {
        if (currentId !== activeSpeechId.current) return;
        onDone?.();
      },
    });
  };

  /** Speak text in the target language (for proper pronunciation) */
  const speakTargetLang = (text: string, onDone?: () => void) => {
    const currentId = activeSpeechId.current;
    // Always read from ref — never stale even if the effect closure is old
    const resolvedLangCode = getTargetLangCode(languageCodeRef.current);
    Speech.speak(text, {
      language: resolvedLangCode,
      rate: 0.8, // Slightly slower for clarity
      onDone: () => {
        if (currentId !== activeSpeechId.current) return;
        onDone?.();
      },
      onError: () => {
        if (currentId !== activeSpeechId.current) return;
        onDone?.();
      },
    });
  };

  /**
   * Dual-language TTS: Speak English explanation first, then
   * the target language phrase for proper native pronunciation.
   */
  const speakTeaching = (englishText: string, targetPhrase: string, onAllDone: () => void) => {
    activeSpeechId.current += 1;
    const currentId = activeSpeechId.current;

    try {
      Speech.stop().catch(() => {});
      setIsAISpeaking(true);

      if (englishText.trim()) {
        // Step 1: Speak English explanation
        speakEnglish(englishText, () => {
          if (currentId !== activeSpeechId.current) return;
          if (targetPhrase.trim()) {
            // Step 2: Speak target language phrase with native pronunciation
            speakTargetLang(targetPhrase, () => {
              if (currentId !== activeSpeechId.current) return;
              setIsAISpeaking(false);
              onAllDone();
            });
          } else {
            setIsAISpeaking(false);
            onAllDone();
          }
        });
      } else if (targetPhrase.trim()) {
        // Only target phrase, no English
        speakTargetLang(targetPhrase, () => {
          if (currentId !== activeSpeechId.current) return;
          setIsAISpeaking(false);
          onAllDone();
        });
      } else {
        setIsAISpeaking(false);
        onAllDone();
      }
    } catch (e) {
      if (currentId !== activeSpeechId.current) return;
      setIsAISpeaking(false);
      onAllDone();
    }
  };

  /** Speak feedback (English only, since feedback is in English) */
  const speakFeedback = (text: string, onDone: () => void) => {
    activeSpeechId.current += 1;
    const currentId = activeSpeechId.current;

    try {
      Speech.stop().catch(() => {});
      setIsAISpeaking(true);

      if (text.trim()) {
        speakEnglish(text, () => {
          if (currentId !== activeSpeechId.current) return;
          setIsAISpeaking(false);
          onDone();
        });
      } else {
        setIsAISpeaking(false);
        onDone();
      }
    } catch (e) {
      if (currentId !== activeSpeechId.current) return;
      setIsAISpeaking(false);
      onDone();
    }
  };

  useEffect(() => {
    // Include languageCode in the key so switching language always re-triggers TTS
    const speakKey = `${sessionPhase}-${currentRound}-${languageCode}`;
    if (lastSpokenKey.current === speakKey) return;
    lastSpokenKey.current = speakKey;

    if (sessionPhase === "teaching") {
      // Speak English explanation, then target language phrase
      speakTeaching(currentTeachingText, currentPracticePrompt, () => {
        setPhase("listening");
      });
    } else if (sessionPhase === "feedback") {
      speakFeedback(aiFeedback.trim(), () => {
        if (currentRound >= totalRounds) {
          setPhase("complete");
        } else {
          nextRound();
          setPhase("teaching");
        }
      });
    } else if (sessionPhase === "complete" || sessionPhase === "idle") {
      lastSpokenKey.current = null;
      activeSpeechId.current += 1;
      Speech.stop().catch(() => {});
    }
  }, [sessionPhase, currentRound, languageCode, currentTeachingText, currentPracticePrompt, aiFeedback, totalRounds, setPhase, nextRound]);

  // Clean up speech when component unmounts
  useEffect(() => {
    return () => {
      lastSpokenKey.current = null;
      activeSpeechId.current += 1;
      Speech.stop().catch(() => {});
    };
  }, []);

  const manualStopRecording = () => {
    if (sessionPhase === "listening") {
      // Use refs to guarantee the correct language even if closure is stale
      stopRecordingAndProcess(languageNameRef.current, languageCodeRef.current);
    }
  };

  return { manualStopRecording };
}
