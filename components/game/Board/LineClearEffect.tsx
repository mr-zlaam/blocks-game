import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useGame } from "@/contexts/GameContext";
import { GRID_SIZE } from "@/lib/game";

interface LineClearEffectProps {
  cellSize: number;
  cellGap: number;
}

/**
 * Renders a bright flash overlay on rows/cols that were just cleared.
 * Flash: white burst → fade out over ~500ms.
 */
export default function LineClearEffect({ cellSize, cellGap }: LineClearEffectProps) {
  const { state } = useGame();
  const flashOpacity = useSharedValue(0);
  const flashScale = useSharedValue(1);

  const { lastClearedLines } = state;

  useEffect(() => {
    if (lastClearedLines) {
      flashOpacity.value = withSequence(
        withTiming(0.9, { duration: 80, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 450, easing: Easing.in(Easing.quad) }),
      );
      flashScale.value = withSequence(
        withTiming(1.05, { duration: 80 }),
        withTiming(1, { duration: 300 }),
      );
    }
  }, [lastClearedLines, flashOpacity, flashScale]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
    transform: [{ scale: flashScale.value }],
  }));

  if (!lastClearedLines) return null;

  const step = cellSize + cellGap;
  const cells: React.JSX.Element[] = [];

  // Render flash on cleared rows
  for (const row of lastClearedLines.rows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      cells.push(
        <Animated.View
          key={`r-${row}-${c}`}
          style={[
            flashStyle,
            {
              position: "absolute",
              left: c * step,
              top: row * step,
              width: cellSize,
              height: cellSize,
              borderRadius: 6,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            },
          ]}
        />,
      );
    }
  }

  // Render flash on cleared columns
  for (const col of lastClearedLines.cols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      // Skip if already covered by a cleared row
      if (lastClearedLines.rows.includes(r)) continue;
      cells.push(
        <Animated.View
          key={`c-${col}-${r}`}
          style={[
            flashStyle,
            {
              position: "absolute",
              left: col * step,
              top: r * step,
              width: cellSize,
              height: cellSize,
              borderRadius: 6,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            },
          ]}
        />,
      );
    }
  }

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      {cells}
    </View>
  );
}
