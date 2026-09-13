import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useGame } from "@/contexts/GameContext";

interface BoardGameOverEffectProps {
  cellSize: number;
  cellGap: number;
}

/**
 * Lightweight game-over overlay — visible dark wash that fades
 * over the board. Single animated view for low-end performance.
 */
export default function BoardGameOverEffect({ cellSize: _cellSize, cellGap: _cellGap }: BoardGameOverEffectProps) {
  const { state } = useGame();
  const [animating, setAnimating] = useState(false);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (state.status === "game_over") {
      setAnimating(true);
      opacity.value = withTiming(0.75, {
        duration: 800,
        easing: Easing.out(Easing.quad),
      });
    } else {
      setAnimating(false);
      opacity.value = 0;
    }
  }, [state.status, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!animating) return null;

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          pointerEvents: "none",
          zIndex: 100,
          backgroundColor: "rgba(15, 14, 23, 0.9)",
          borderRadius: 16,
        },
        animatedStyle,
      ]}
    />
  );
}
