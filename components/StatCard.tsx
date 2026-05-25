import React from 'react';
import { View, Text } from "@/components/tw";
import { Ionicons } from "@expo/vector-icons";

interface StatCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgClass: string;
  value: string | number;
  title: string;
  numberOfLines?: number;
}

export function StatCard({
  iconName,
  iconColor,
  iconBgClass,
  value,
  title,
  numberOfLines,
}: StatCardProps) {
  return (
    <View className="flex-1 p-4 card-3d bg-white flex-row items-center">
      <View className={`w-10 h-10 rounded-full justify-center items-center mr-3 ${iconBgClass}`}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text 
          className="text-h4 text-text-primary font-black leading-tight"
          numberOfLines={numberOfLines}
        >
          {value}
        </Text>
        <Text className="text-[11px] text-text-secondary font-bold uppercase tracking-wider mt-0.5">
          {title}
        </Text>
      </View>
    </View>
  );
}
