import React, { useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import { View, Text } from "@/components/tw";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";


export default function GroupFiveAnimation() {
  // Globe rotation shared value (shifting continents offset)
  const globeRotation = useSharedValue(0);
  
  // Bobbing animation for the carved "GROUP 5" sign
  const signBob = useSharedValue(0);
  
  // Waving / working shared values for the humans
  const devHands = useSharedValue(0);
  const engWrench = useSharedValue(0);
  const artBrush = useSharedValue(0);
  const testHead = useSharedValue(0);
  const testerBob = useSharedValue(0);
  const testerClipboard = useSharedValue(0);
  const cheerArms = useSharedValue(0);
  
  // Floating particle shared values
  const floatCodeY = useSharedValue(0);
  const floatCodeOpacity = useSharedValue(0);
  const floatGearRotation = useSharedValue(0);
  const floatSparkleScale = useSharedValue(0);

  // Setup animations on mount
  useEffect(() => {
    // 1. Globe continuous rotation (left to right)
    globeRotation.value = withRepeat(
      withTiming(-160, {
        duration: 12000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // 2. Sign bobbing up & down
    signBob.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(6, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 3. Developer typing hands bobbing
    devHands.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 150, easing: Easing.linear }),
        withTiming(4, { duration: 150, easing: Easing.linear })
      ),
      -1,
      true
    );

    // 4. Engineer wrench swing
    engWrench.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(20, { duration: 450, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 5. Artist brush stroke
    artBrush.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 6a. Tester body bobbing
    testerBob.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(3, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 6b. Tester nodding/inspecting (head)
    testHead.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(8, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 6c. Tester clipboard arm (swings up/down as if reviewing)
    testerClipboard.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(6, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 7. Cheering bottom human arms waving
    cheerArms.value = withRepeat(
      withSequence(
        withTiming(-45, { duration: 250, easing: Easing.inOut(Easing.ease) }),
        withTiming(45, { duration: 250, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 8. Code particles floating up
    floatCodeY.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-30, { duration: 2000, easing: Easing.out(Easing.ease) })
      ),
      -1,
      false
    );
    floatCodeOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 600 })
      ),
      -1,
      false
    );

    // 9. Gear rotating continuously
    floatGearRotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    // 10. Sparkle scales pulsating
    floatSparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animated Styles
  const animatedGlobeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: globeRotation.value }],
  }));

  const animatedSignStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: signBob.value },
      { rotateZ: `${signBob.value / 4}deg` }
    ],
  }));

  const animatedDevHands = useAnimatedStyle(() => ({
    transform: [{ translateY: devHands.value }],
  }));

  const animatedWrenchStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${engWrench.value}deg` }],
  }));

  const animatedBrushStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: artBrush.value },
      { rotateZ: `${artBrush.value / 2}deg` }
    ],
  }));

  const animatedTestHeadStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${testHead.value}deg` }],
  }));

  const animatedTesterBodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: testerBob.value }],
  }));

  const animatedClipboardStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: `${testerClipboard.value}deg` },
      { translateY: testerClipboard.value / 3 },
    ],
  }));

  const animatedCheerLeftArm = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: `${cheerArms.value - 60}deg` },
      { translateX: -3 },
      { translateY: -3 }
    ],
  }));

  const animatedCheerRightArm = useAnimatedStyle(() => ({
    transform: [
      { rotateZ: `${-cheerArms.value + 60}deg` },
      { translateX: 3 },
      { translateY: -3 }
    ],
  }));

  const animatedCodeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatCodeY.value }],
    opacity: floatCodeOpacity.value,
  }));

  const animatedGearStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${floatGearRotation.value}deg` }],
  }));

  const animatedSparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: floatSparkleScale.value }],
  }));

  return (
    <View className="mx-6 mt-6 mb-8 p-6 rounded-3xl bg-[#EEF4FA] border-2 border-[#CBD5E1] border-b-[6px] items-center justify-center overflow-hidden">
      {/* Decorative Background Elements */}
      <View className="bg-[#FFFFFF]/60 px-3 py-1 rounded-full border border-[#E2E8F0] self-center mb-2">
        <Text className="text-caption text-[#475569] font-bold tracking-wider uppercase">Vexora Developers</Text>
      </View>

      {/* Background Cloud Left */}
      <View className="absolute top-10 -left-6 w-20 h-8 bg-white/70 rounded-full" />
      {/* Background Cloud Right */}
      <View className="absolute top-16 -right-4 w-16 h-6 bg-white/70 rounded-full" />

      {/* Main Animation Container */}
      <View className="w-full h-[220] justify-center items-center relative mt-4">
        
        {/* Shadow under the globe */}
        <View className="absolute bottom-4 w-[180px] h-[12px] bg-black/10 rounded-full self-center" />

        {/* 1. THE GLOBE */}
        <View className="w-[140px] h-[140px] rounded-full bg-[#1D4ED8] overflow-hidden border-4 border-[#3B82F6] relative z-10">
          
          {/* Scrollable Continent Track */}
          <Animated.View style={[styles.continentTrack, animatedGlobeStyle]}>
            {/* Continent Pattern 1 */}
            <View style={styles.continentsContainer}>
              <View className="absolute top-4 left-4 w-12 h-10 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-14 left-8 w-16 h-12 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-8 left-20 w-8 h-8 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-22 left-2 w-10 h-6 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-18 left-28 w-10 h-10 bg-[#22C55E] rounded-full opacity-90" />
            </View>
            {/* Continent Pattern 2 (identical tiling for seamless rotation) */}
            <View style={styles.continentsContainer}>
              <View className="absolute top-4 left-4 w-12 h-10 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-14 left-8 w-16 h-12 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-8 left-20 w-8 h-8 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-22 left-2 w-10 h-6 bg-[#22C55E] rounded-full opacity-90" />
              <View className="absolute top-18 left-28 w-10 h-10 bg-[#22C55E] rounded-full opacity-90" />
            </View>
          </Animated.View>

          {/* Gridlines Overlay */}
          <View className="absolute inset-0 border border-white/10 rounded-full" />
          <View className="absolute top-1/2 left-0 right-0 h-[1] bg-white/10" />
          <View className="absolute top-0 bottom-0 left-1/2 w-[1] bg-white/10" />

          {/* Spherical Inner Edge Shadow */}
          <View className="absolute inset-0 rounded-full border-b-8 border-r-8 border-black/15" />
          <View className="absolute inset-0 rounded-full border-t-4 border-l-4 border-white/10" />
          
          {/* Specular Glow Highlight */}
          <View className="absolute top-2 left-4 w-14 h-6 rounded-full bg-white/20 -rotate-[30deg]" />
        </View>

        {/* 2. THE 3D CARVED TEXT (GROUP 5) */}
        {/* Positioned on top-front of the globe */}
        <Animated.View 
          style={[styles.signContainer, animatedSignStyle]}
          className="z-30 absolute top-[90px] self-center flex-row items-center"
        >
          {/* Sparkles around text */}
          <Animated.View style={[styles.sparkleLeft, animatedSparkleStyle]}>
            <Ionicons name="sparkles" size={16} color="#EAB308" />
          </Animated.View>

          {/* Carved 3D card */}
          <View className="px-5 py-2.5 bg-[#FF9F1C] rounded-2xl border-2 border-[#E76F51] border-b-[8px] border-b-[#D64E12] flex-row items-center gap-1.5 shadow-lg shadow-black/20">
            <Text className="text-h3 font-black text-white tracking-widest" style={styles.signText}>
              GROUP 5
            </Text>
          </View>

          <Animated.View style={[styles.sparkleRight, animatedSparkleStyle]}>
            <Ionicons name="sparkles" size={16} color="#EAB308" />
          </Animated.View>
        </Animated.View>

        {/* 3. FIVE 3D-STYLE HUMAN CHARACTERS */}

        {/* HUMAN 1: Developer (Top Left) */}
        <View className="absolute top-2 left-[30px] items-center z-20">
          {/* Floating code block */}
          <Animated.View style={[animatedCodeStyle, styles.floatLabel]} className="bg-[#10B981] px-1.5 py-0.5 rounded border border-[#059669]">
            <Text className="text-[9px] text-white font-bold">{"</>"}</Text>
          </Animated.View>
          {/* Human */}
          <View className="items-center">
            {/* Hard Hat */}
            <View className="w-5 h-3 bg-[#EAB308] border-b border-[#CA8A04] rounded-t-full relative top-0.5 z-10" />
            {/* Head */}
            <View className="w-4 h-4 bg-[#FED7AA] rounded-full items-center justify-center border border-[#FDBA74]">
              {/* Dot Eyes */}
              <View className="flex-row gap-0.5 top-0.5">
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
              </View>
            </View>
            {/* Body */}
            <View className="w-5 h-6 bg-[#3B82F6] rounded-md border border-[#2563EB] items-center justify-center relative">
              {/* Keyboard Arms typing */}
              <Animated.View style={[animatedDevHands, styles.devArmLeft]} />
              <Animated.View style={[animatedDevHands, styles.devArmRight]} />
            </View>
            {/* Legs */}
            <View className="flex-row gap-1">
              <View className="w-1.5 h-2.5 bg-[#475569] rounded-b-sm" />
              <View className="w-1.5 h-2.5 bg-[#475569] rounded-b-sm" />
            </View>
          </View>
        </View>

        {/* HUMAN 2: Engineer with Gear & Wrench (Top Right) */}
        <View className="absolute top-2 right-[30px] items-center z-20">
          {/* Rotating Gear next to the Engineer */}
          <Animated.View style={[animatedGearStyle, styles.floatGear]}>
            <Ionicons name="settings" size={16} color="#94A3B8" />
          </Animated.View>
          
          <View className="items-center">
            {/* Safety Hat */}
            <View className="w-5 h-3 bg-[#EAB308] border-b border-[#CA8A04] rounded-t-full relative top-0.5 z-10">
              <View className="w-1 h-2 bg-[#CA8A04] absolute left-2 -top-1 rounded-sm" />
            </View>
            {/* Head */}
            <View className="w-4 h-4 bg-[#FDBA74] rounded-full items-center justify-center border border-[#F59E0B]">
              <View className="flex-row gap-0.5 top-0.5">
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
              </View>
            </View>
            {/* Body */}
            <View className="w-5 h-6 bg-[#EF4444] rounded-md border border-[#DC2626] relative">
              {/* Arm swinging wrench */}
              <Animated.View style={[animatedWrenchStyle, styles.wrenchArm]}>
                <View className="w-1.5 h-4 bg-[#EF4444] rounded-full absolute -right-0.5 -bottom-0.5 origin-top">
                  <View className="w-3.5 h-3.5 bg-[#64748B] rounded-full absolute -bottom-2 -left-1 items-center justify-center">
                    <Ionicons name="build" size={8} color="#FFFFFF" />
                  </View>
                </View>
              </Animated.View>
            </View>
            {/* Legs */}
            <View className="flex-row gap-1">
              <View className="w-1.5 h-2.5 bg-[#334155] rounded-b-sm" />
              <View className="w-1.5 h-2.5 bg-[#334155] rounded-b-sm" />
            </View>
          </View>
        </View>

        {/* HUMAN 3: Artist painting the globe (Bottom Left) */}
        <View className="absolute bottom-[20px] left-[15px] items-center z-20">
          <View className="items-center">
            {/* Red Beret Hat */}
            <View className="w-5 h-2.5 bg-[#B91C1C] rounded-full relative top-0.5 z-10" />
            {/* Head */}
            <View className="w-4 h-4 bg-[#FFD8A8] rounded-full items-center justify-center border border-[#FDBA74]">
              <View className="flex-row gap-0.5 top-0.5">
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
              </View>
            </View>
            {/* Body */}
            <View className="w-5 h-6 bg-[#8B5CF6] rounded-md border border-[#7C3AED] relative">
              {/* Arm holding brush */}
              <Animated.View style={[animatedBrushStyle, styles.artistArm]}>
                <View className="w-1.5 h-4 bg-[#8B5CF6] rounded-full absolute -bottom-1">
                  <View className="w-3 h-3 bg-[#EAB308] rounded-full absolute -bottom-1 -left-0.5 items-center justify-center">
                    <View className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
                  </View>
                </View>
              </Animated.View>
            </View>
            {/* Legs */}
            <View className="flex-row gap-1">
              <View className="w-1.5 h-2.5 bg-[#1E293B] rounded-b-sm" />
              <View className="w-1.5 h-2.5 bg-[#1E293B] rounded-b-sm" />
            </View>
          </View>
        </View>

        {/* HUMAN 4: Tester checking output (Bottom Right) */}
        <View className="absolute bottom-[20px] right-[15px] items-center z-20">
          {/* Whole-body bob wraps the tester character */}
          <Animated.View style={animatedTesterBodyStyle} className="items-center">
            {/* Blue cap */}
            <View className="w-5 h-2 bg-[#0EA5E9] rounded-t-md relative top-0.5 z-10">
              <View className="w-2 h-1 bg-[#0EA5E9] absolute -right-1 bottom-0 rounded-r-full" />
            </View>
            {/* Head – nods left/right */}
            <Animated.View
              style={animatedTestHeadStyle}
              className="w-4 h-4 bg-[#FFD8A8] rounded-full items-center justify-center border border-[#FDBA74]"
            >
              <View className="flex-row gap-0.5 top-0.5">
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
                <View className="w-[1.5] h-[1.5] bg-[#374151] rounded-full" />
              </View>
            </Animated.View>
            {/* Body */}
            <View className="w-5 h-6 bg-[#10B981] rounded-md border border-[#059669] relative items-center justify-center">
              {/* Clipboard arm swings up/down as if reviewing */}
              <Animated.View style={[animatedClipboardStyle, styles.clipboardArm]}>
                <View className="w-3.5 h-4 bg-white border border-[#CBD5E1] rounded-sm items-center justify-center">
                  <Ionicons name="checkmark-circle" size={9} color="#10B981" />
                </View>
              </Animated.View>
            </View>
            {/* Legs */}
            <View className="flex-row gap-1 mt-1">
              <View className="w-1.5 h-2 bg-[#334155] rounded-b-sm" />
              <View className="w-1.5 h-2 bg-[#334155] rounded-b-sm" />
            </View>
          </Animated.View>
        </View>

        {/* HUMAN 5: Cheering Team Leader (Bottom Center, Supporting the Sign) */}
        <View className="absolute bottom-[2px] self-center items-center z-40">
          <View className="items-center">
            {/* Green headband */}
            <View className="w-4 h-1.5 bg-[#22C55E] absolute top-1 z-10 rounded-sm" />
            {/* Head */}
            <View className="w-4 h-4 bg-[#FED7AA] rounded-full items-center justify-center border border-[#FDBA74]">
              {/* Cheerful smiling eyes/mouth */}
              <View className="w-3 h-1.5 justify-between flex-row px-0.5 top-0.5">
                <View className="w-1 h-[1] bg-[#374151] rounded-full" />
                <View className="w-1 h-[1] bg-[#374151] rounded-full" />
              </View>
              <View className="w-1.5 h-[1.5] bg-[#EF4444] rounded-b-full top-0.5" />
            </View>
            {/* Body */}
            <View className="w-5 h-5 bg-[#EC4899] rounded-md border border-[#DB2777] relative items-center">
              {/* Left Cheer Arm */}
              <Animated.View style={[animatedCheerLeftArm, styles.cheerArmLeft]}>
                <View className="w-1.5 h-4 bg-[#FED7AA] rounded-full border border-[#FDBA74]" />
              </Animated.View>
              {/* Right Cheer Arm */}
              <Animated.View style={[animatedCheerRightArm, styles.cheerArmRight]}>
                <View className="w-1.5 h-4 bg-[#FED7AA] rounded-full border border-[#FDBA74]" />
              </Animated.View>
            </View>
            {/* Legs */}
            <View className="flex-row gap-1">
              <View className="w-1.5 h-2 bg-[#1E293B] rounded-b-sm" />
              <View className="w-1.5 h-2 bg-[#1E293B] rounded-b-sm" />
            </View>
          </View>
        </View>

      </View>
      
      {/* Playful team caption */}
      <Text className="text-body-sm text-[#64748B] font-bold text-center mt-3 leading-relaxed px-4">
        We are building the future of Mobile_Dev, with MR. SMITH😎
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  continentTrack: {
    flexDirection: "row",
    position: "absolute",
    height: 140,
    width: 320, // 160 (globe width equivalent) * 2
  },
  continentsContainer: {
    width: 160,
    height: 140,
    position: "relative",
  },
  signContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  signText: {
    textShadowColor: "rgba(0, 0, 0, 0.15)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif-condensed",
  },
  sparkleLeft: {
    position: "absolute",
    left: -20,
    top: 6,
  },
  sparkleRight: {
    position: "absolute",
    right: -20,
    top: 6,
  },
  floatLabel: {
    position: "absolute",
    top: -12,
    zIndex: 30,
  },
  floatGear: {
    position: "absolute",
    left: -18,
    top: 10,
    zIndex: 30,
  },
  devArmLeft: {
    width: 3,
    height: 6,
    backgroundColor: "#FED7AA",
    borderRadius: 2,
    position: "absolute",
    left: -2,
    top: 6,
  },
  devArmRight: {
    width: 3,
    height: 6,
    backgroundColor: "#FED7AA",
    borderRadius: 2,
    position: "absolute",
    right: -2,
    top: 6,
  },
  wrenchArm: {
    width: 6,
    height: 4,
    backgroundColor: "#FED7AA",
    position: "absolute",
    right: -4,
    top: 4,
  },
  artistArm: {
    width: 6,
    height: 4,
    backgroundColor: "#FFD8A8",
    position: "absolute",
    left: -4,
    top: 4,
  },
  cheerArmLeft: {
    position: "absolute",
    left: -4,
    top: 2,
    height: 12,
    transformOrigin: "top right",
  },
  cheerArmRight: {
    position: "absolute",
    right: -4,
    top: 2,
    height: 12,
    transformOrigin: "top left",
  },
  clipboardArm: {
    position: "absolute",
    bottom: -6,
    left: -4,
    transformOrigin: "top center",
  },
});
