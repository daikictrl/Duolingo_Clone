import React from "react";
import { View, Text, Pressable } from "@/components/tw";
import { Ionicons } from "@expo/vector-icons";

interface ProgressHeaderProps {
  progressPercent: number;
  xpReward: number;
  onClose: () => void;
}

export function ProgressHeader({ progressPercent, xpReward, onClose }: ProgressHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
      <Pressable
        onPress={onClose}
        className="w-10 h-10 rounded-full border border-slate-200 justify-center items-center active:bg-slate-100"
      >
        <Ionicons name="close" size={20} color="#64748B" />
      </Pressable>

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
          +{xpReward} XP
        </Text>
      </View>
    </View>
  );
}
