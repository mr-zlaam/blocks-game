import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";

import { useGame } from "@/contexts/GameContext";
import { playSound } from "@/lib/audio";

interface BoardIntroEffectProps {
  cellSize: number;
  cellGap: number;
}

/**
 * Lightweight intro effect — single animated overlay with a visible
 * purple glow pulse. Performs well on low-end devices.
 */
export default function BoardIntroEffect({ cellSize: _cellSize, cellGap: _cellGap }: BoardIntroEffectProps) {
  const { state } = useGame();
  const [animating, setAnimating] = useState(false);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.85);

  const isBoardEmpty = state.grid.every((row) => row.every((cell) => !cell.filled));

  useEffect(() => {
    if (isBoardEmpty && state.status === "playing") {
      setAnimating(true);

      if (state.piecesPlaced > 0) {
        void playSound("bonus");
      }

      // Visible pulse: scale up + fade in → hold → fade out
      opacity.value = withSequence(
        withTiming(0.6, { duration: 300, easing: Easing.out(Easing.quad) }),
        withDelay(400, withTiming(0, { duration: 400, easing: Easing.in(Easing.quad) }, (finished) => {
          if (finished) runOnJS(setAnimating)(false);
        })),
      );
      scale.value = withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.3)) }),
        withDelay(400, withTiming(1.02, { duration: 400, easing: Easing.in(Easing.quad) })),
      );
    }
  }, [isBoardEmpty, state.status, state.piecesPlaced, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!animating) return null;

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, { pointerEvents: "none", zIndex: 100 }, animatedStyle]}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(115, 103, 240, 0.35)",
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "rgba(115, 103, 240, 0.5)",
          },
        ]}
      />
    </Animated.View>
  );
}
