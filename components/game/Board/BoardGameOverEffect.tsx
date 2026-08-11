import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { useGame } from "@/contexts/GameContext";
import { GRID_SIZE } from "@/lib/game";
import { getProportionalBevel } from "@/components/game/BlockShape/styles";

interface BoardGameOverEffectProps {
  cellSize: number;
  cellGap: number;
}

export default function BoardGameOverEffect({ cellSize, cellGap }: BoardGameOverEffectProps) {
  const { state } = useGame();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (state.status === "game_over") {
      setAnimating(true);
    } else {
      setAnimating(false);
    }
  }, [state.status]);

  if (!animating) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none", zIndex: 100 }]}>
      {Array.from({ length: GRID_SIZE }).map((_, r) =>
        Array.from({ length: GRID_SIZE }).map((_, c) => (
          <GameOverCell
            key={`${r}-${c}`}
            row={r}
            col={c}
            cellSize={cellSize}
            cellGap={cellGap}
          />
        ))
      )}
    </View>
  );
}

function GameOverCell({ row, col, cellSize, cellGap }: any) {
  const scale = useSharedValue(0);
  const { radius, bevelLight, bevelDark } = getProportionalBevel(cellSize);
  
  useEffect(() => {
    // Fill wave (top-left to bottom-right)
    const fillDelay = (row + col) * 60;
    
    scale.value = withDelay(
      fillDelay, 
      withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.5)) })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const step = cellSize + cellGap;

  return (
    <Animated.View
      className="bg-surface overflow-hidden"
      style={[
        {
          position: "absolute",
          top: row * step,
          left: col * step,
          width: cellSize,
          height: cellSize,
          borderRadius: radius,
          borderTopWidth: bevelLight,
          borderLeftWidth: bevelLight,
          borderBottomWidth: bevelDark,
          borderRightWidth: bevelDark,
          borderTopColor: "rgba(255, 255, 255, 0.15)",
          borderLeftColor: "rgba(255, 255, 255, 0.05)",
          borderBottomColor: "rgba(0, 0, 0, 0.25)",
          borderRightColor: "rgba(0, 0, 0, 0.15)",
        },
        style,
      ]}
    />
  );
}
