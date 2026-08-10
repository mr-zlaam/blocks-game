import { useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { SPRING_PRESS, SPRING_BOUNCE } from "@/lib/animations";

const PRESSED_SCALE = 0.94;
const PRESSED_OPACITY = 0.85;
const DEFAULT_SCALE = 1;
const DEFAULT_OPACITY = 1;

/**
 * Handles press-in / press-out spring animation for a button.
 * Returns animated style and press event handlers.
 */
export function useButtonAnimation(isDisabled: boolean) {
  const scale = useSharedValue(DEFAULT_SCALE);
  const opacity = useSharedValue(DEFAULT_OPACITY);

  const handlePressIn = useCallback(() => {
    if (isDisabled) return;
    scale.value = withSpring(PRESSED_SCALE, SPRING_PRESS);
    opacity.value = withSpring(PRESSED_OPACITY, SPRING_PRESS);
  }, [isDisabled, scale, opacity]);

  const handlePressOut = useCallback(() => {
    if (isDisabled) return;
    scale.value = withSpring(DEFAULT_SCALE, SPRING_BOUNCE);
    opacity.value = withSpring(DEFAULT_OPACITY, SPRING_BOUNCE);
  }, [isDisabled, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return { animatedStyle, handlePressIn, handlePressOut } as const;
}
