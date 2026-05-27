import React, { useEffect, ComponentProps } from "react";
import { View, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import { Text } from "@/components/tw";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/theme/colors";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { RouteProp, ParamListBase } from "@react-navigation/native";

const circleSize = 48;

// Icon mappings based on route name
const getIconName = (routeKey: string): string => {
  switch (routeKey) {
    case "index":
      return "home";
    case "learn":
      return "book";
    case "chat":
      return "chatbubble-ellipses";
    case "ai-teacher":
      return "brain";
    case "profile":
      return "person";
    default:
      return "help-circle";
  }
};

// Label mappings based on route name
const getLabel = (routeKey: string): string => {
  switch (routeKey) {
    case "index":
      return "Home";
    case "learn":
      return "Learn";
    case "chat":
      return "Chat";
    case "ai-teacher":
      return "Teacher";
    case "profile":
      return "Profile";
    default:
      return routeKey;
  }
};

const TabItem = ({
  isFocused,
  label,
  routeName,
  onPress,
  onLongPress,
}: {
  isFocused: boolean;
  label: string;
  routeName: string;
  onPress: () => void;
  onLongPress: () => void;
}) => {
  const focusProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: 200,
      easing: Easing.linear,
    });
  }, [isFocused, focusProgress]);

  const animatedIconStyle = useAnimatedStyle(() => {
    // Translate the icon downwards when active so it centers inside the active circle.
    // Inactive is slightly shifted up to make space for the label.
    const translateY = interpolate(focusProgress.value, [0, 1], [-2, 5]);
    return {
      transform: [{ translateY }],
    };
  });

  const animatedLabelStyle = useAnimatedStyle(() => {
    const opacity = interpolate(focusProgress.value, [0, 1], [1, 0]);
    const scale = interpolate(focusProgress.value, [0, 1], [1, 0.6]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const baseIconName = getIconName(routeName);
  const iconName = (isFocused ? baseIconName : `${baseIconName}-outline`) as ComponentProps<typeof Ionicons>["name"];

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
      style={styles.tabButton}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      testID={`tab-${routeName}`}
    >
      <View style={styles.tabItemContainer}>
        {/* Animated Icon */}
        <Animated.View style={[styles.iconWrapper, animatedIconStyle]}>
          {baseIconName === "brain" ? (
            <MaterialCommunityIcons
              name="brain"
              size={24}
              color={isFocused ? "#FFFFFF" : "#8E9CAE"}
            />
          ) : (
            <Ionicons
              name={iconName}
              size={22}
              color={isFocused ? "#FFFFFF" : "#8E9CAE"}
            />
          )}
        </Animated.View>

        {/* Animated Label */}
        <Animated.View style={[styles.labelWrapper, animatedLabelStyle]}>
          <Text style={[styles.label, { color: "#8E9CAE" }]}>
            {label}
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { width: screenWidth } = useWindowDimensions();
  const numTabs = state.routes.length || 5;
  const tabWidth = screenWidth / numTabs;
  const circleLeftOffset = (tabWidth - circleSize) / 2;

  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(state.index * tabWidth + circleLeftOffset);

  // Sync translation when selected index or layout dimensions change
  useEffect(() => {
    const targetX = state.index * tabWidth + circleLeftOffset;
    translateX.value = withTiming(targetX, {
      duration: 200,
      easing: Easing.linear,
    });
  }, [state.index, tabWidth, circleLeftOffset, translateX]);

  const animatedCircleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
      ]}
      className="border-t border-border-gray bg-white"
    >
      {/* Sliding Active Indicator Circle */}
      <Animated.View
        style={[
          styles.activeCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: COLORS.primary,
            top: (60 - circleSize) / 2, // Centered vertically in the 60px height
          },
          animatedCircleStyle,
        ]}
      />

      {/* Tab Buttons */}
      {state.routes.map((route: RouteProp<ParamListBase, string>, index: number) => {
        const isFocused = state.index === index;
        const label = getLabel(route.name);

        const onPress = () => {
          // Trigger subtle selection haptics
          Haptics.selectionAsync().catch(() => {});

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabItem
            key={route.key}
            isFocused={isFocused}
            label={label}
            routeName={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    position: "relative",
    // Premium shadow for the tab bar
    ...Platform.select({
      ios: {
        shadowColor: "#0D132B",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activeCircle: {
    position: "absolute",
    left: 0,
    zIndex: 0,
  },
  tabButton: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  tabItemContainer: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  iconWrapper: {
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  labelWrapper: {
    height: 14,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 10,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
});
