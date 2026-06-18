import { create } from "zustand";
import { AudioModule, requestRecordingPermissionsAsync, setAudioModeAsync, RecordingPresets } from "expo-audio";
import type { AudioRecorder } from "expo-audio";
import * as Speech from "expo-speech";
import { generateTeacherResponse, transcribeTeacherAudio, TeacherResponse } from "@/lib/aiTeacher";

export type SessionPhase = "idle" | "teaching" | "listening" | "processing" | "feedback" | "complete";

interface AITeacherState {
  isSessionActive: boolean;
  currentRound: number;
  totalRounds: number;
  sessionPhase: SessionPhase;
  
  conversationHistory: { role: "ai" | "user"; text: string }[];
  
  currentTeachingText: string;
  currentPracticePrompt: string;
  userTranscription: string;
  aiFeedback: string;
  currentTranslation: string;
  
  isRecording: boolean;
  recordingUri: string | null;
  recordingStartTime: number | null;
  recording: AudioRecorder | null;

  isAISpeaking: boolean;
  error: string | null;
  scores: number[];
  
  startSession: (languageName: string, languageCode: string) => Promise<void>;
  endSession: () => void;
  setPhase: (phase: SessionPhase) => void;
  setIsAISpeaking: (isSpeaking: boolean) => void;
  
  startRecording: () => Promise<void>;
  stopRecordingAndProcess: (languageName: string, languageCode: string) => Promise<void>;
  nextRound: () => void;
  
  reset: () => void;
}

const ensureValidResponse = (response: any, languageName: string, round: number, totalRounds: number) => {
  let practicePrompt = response.practicePrompt || "";
  let teachingText = response.teachingText || "";
  let translation = response.translation || "";
  
  if (round < totalRounds && !practicePrompt.trim()) {
    console.warn("[aiTeacherStore] AI response was missing practicePrompt. Using fallback.");
    const langLower = languageName.toLowerCase();
    if (langLower.includes("french")) {
      practicePrompt = "Merci beaucoup";
      teachingText = "Let's keep learning. Let's practice saying 'Merci beaucoup', which means 'Thank you very much'.";
      translation = "Merci beaucoup";
    } else if (langLower.includes("spanish") || langLower.includes("castilian")) {
      practicePrompt = "Muchas gracias";
      teachingText = "Let's keep learning. Let's practice saying 'Muchas gracias', which means 'Thank you very much'.";
      translation = "Muchas gracias";
    } else if (langLower.includes("german")) {
      practicePrompt = "Vielen Dank";
      teachingText = "Let's keep learning. Let's practice saying 'Vielen Dank', which means 'Thank you very much'.";
      translation = "Vielen Dank";
    } else if (langLower.includes("italian")) {
      practicePrompt = "Grazie mille";
      teachingText = "Let's keep learning. Let's practice saying 'Grazie mille', which means 'Thank you very much'.";
      translation = "Grazie mille";
    } else {
      practicePrompt = "Hello";
      teachingText = "Let's practice saying 'Hello'.";
      translation = "Hello";
    }
  }

  return {
    ...response,
    practicePrompt,
    teachingText,
    translation,
  };
};

export const useAITeacherStore = create<AITeacherState>((set, get) => ({
  isSessionActive: false,
  currentRound: 1,
  totalRounds: 3,
  sessionPhase: "idle",
  
  conversationHistory: [],
  
  currentTeachingText: "",
  currentPracticePrompt: "",
  userTranscription: "",
  aiFeedback: "",
  currentTranslation: "",
  
  isRecording: false,
  recordingUri: null,
  recordingStartTime: null,
  recording: null,

  isAISpeaking: false,
  error: null,
  scores: [],

  nextRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),

  startSession: async (languageName: string, languageCode: string) => {
    Speech.stop().catch(() => {});
    set({
      isSessionActive: true,
      currentRound: 1,
      sessionPhase: "processing",
      conversationHistory: [],
      error: null,
      scores: [],
      currentTeachingText: "",
      currentPracticePrompt: "",
      aiFeedback: "",
      userTranscription: "",
      currentTranslation: "",
    });
    
    try {
      const rawResponse = await generateTeacherResponse(languageName, [], 1);
      const response = ensureValidResponse(rawResponse, languageName, 1, 3);
      
      set((state) => ({
        sessionPhase: "teaching",
        currentTeachingText: response.teachingText || "",
        currentPracticePrompt: response.practicePrompt || "",
        currentTranslation: response.translation,
        conversationHistory: [
          ...state.conversationHistory,
          { role: "ai", text: `${response.teachingText} ${response.practicePrompt}`.trim() }
        ]
      }));
    } catch (error: any) {
      console.error("[startSession] ERROR:", error);
      set({ error: error.message, sessionPhase: "idle" });
    }
  },

  endSession: () => {
    Speech.stop().catch(() => {});
    const { recording } = get();
    if (recording?.isRecording) {
      recording.stop().catch(() => {});
    }
    set({
      isSessionActive: false,
      sessionPhase: "idle",
      isRecording: false,
      recording: null,
      recordingUri: null,
      userTranscription: "",
      currentTranslation: "",
    });
  },

  setPhase: (phase: SessionPhase) => set({ sessionPhase: phase }),
  
  setIsAISpeaking: (isSpeaking: boolean) => set({ isAISpeaking: isSpeaking }),

  startRecording: async () => {
    try {
      const currentRecording = get().recording;
      if (currentRecording?.isRecording) {
        await currentRecording.stop();
      }

      set({ error: null });
      
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Microphone permission denied");
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      const recording = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
      await recording.prepareToRecordAsync();
      recording.record();
      
      set({ recording, isRecording: true, recordingStartTime: Date.now() });
    } catch (err: any) {
      set({ error: err.message || "Failed to start recording" });
    }
  },

  stopRecordingAndProcess: async (languageName: string, languageCode: string) => {
    const { recording, isRecording, currentRound, totalRounds, conversationHistory } = get();
    if (!recording || !isRecording) return;

    try {
      set({ isRecording: false, sessionPhase: "processing", userTranscription: "" });
      await recording.stop();
      const uri = recording.uri;
      
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });

      set({ recordingUri: uri || null, recording: null });

      if (!uri) throw new Error("Recording failed to produce a valid URI");

      // 1. Transcribe audio
      const transcription = await transcribeTeacherAudio(uri, languageCode);
      set({ userTranscription: transcription });
      
      const newHistory: AITeacherState["conversationHistory"] = [
        ...conversationHistory,
        { role: "user", text: transcription }
      ];

      // 2. Send transcription to AI for assessment & next step
      const rawAiResponse = await generateTeacherResponse(
        languageName,
        newHistory,
        currentRound,
        transcription
      );

      const aiResponse = ensureValidResponse(rawAiResponse, languageName, currentRound, totalRounds);

      const finalHistory: AITeacherState["conversationHistory"] = [
        ...newHistory,
        { role: "ai", text: `${aiResponse.feedback} ${aiResponse.teachingText || ""} ${aiResponse.practicePrompt || ""}`.trim() }
      ];

      const scoreValue = typeof aiResponse.score === "number" ? aiResponse.score : Number(aiResponse.score) || 0;
      const newScores = [...get().scores, scoreValue];

      set({
        aiFeedback: aiResponse.feedback || "",
        currentTeachingText: aiResponse.teachingText || "",
        currentPracticePrompt: aiResponse.practicePrompt || "",
        currentTranslation: aiResponse.translation,
        conversationHistory: finalHistory,
        scores: newScores,
      });

      set({ sessionPhase: "feedback" });

    } catch (err: any) {
      console.error("[stopRecordingAndProcess] ERROR:", err);
      set({ error: err.message || "Failed to process audio", sessionPhase: "listening" });
    }
  },

  reset: () => {
    Speech.stop().catch(() => {});
    const { recording } = get();
    if (recording?.isRecording) {
      recording.stop().catch(() => {});
    }
    set({
      isSessionActive: false,
      currentRound: 1,
      sessionPhase: "idle",
      conversationHistory: [],
      currentTeachingText: "",
      currentPracticePrompt: "",
      userTranscription: "",
      aiFeedback: "",
      currentTranslation: "",
      isRecording: false,
      recordingUri: null,
      recordingStartTime: null,
      recording: null,
      isAISpeaking: false,
      error: null,
      scores: [],
    });
  }
}));
