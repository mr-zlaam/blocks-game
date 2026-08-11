import { useCallback } from "react";
import { Pressable, PressableProps, GestureResponderEvent } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface BouncyButtonProps extends PressableProps {
  haptic?: "Light" | "Medium" | "Heavy" | "None";
}

/**
 * A simple wrapper around Pressable that provides a springy bouncy animation
 * and integrated haptic feedback.
 */
export function BouncyButton({ 
  onPress, 
  children, 
  style, 
  className, 
  haptic = "Medium", 
  ...props 
}: BouncyButtonProps) {
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback((e: GestureResponderEvent) => {
    if (haptic === "Light") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    else if (haptic === "Heavy") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    else if (haptic === "Medium") void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (onPress) onPress(e);
  }, [haptic, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[style, animatedStyle]}
      className={className}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
