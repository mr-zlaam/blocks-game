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
import { GRID_SIZE, BlockColor } from "@/lib/game";
import { BLOCK_COLOR_CLASSES, getProportionalBevel, BEVEL_COLORS } from "@/components/game/BlockShape/styles";

const COLORS: BlockColor[] = ["red", "blue", "green", "yellow", "purple", "cyan", "orange"];

interface BoardIntroEffectProps {
  cellSize: number;
  cellGap: number;
}

export default function BoardIntroEffect({ cellSize, cellGap }: BoardIntroEffectProps) {
  const { state } = useGame();
  const [animating, setAnimating] = useState(false);

  // Trigger animation if the board is completely empty (start of game or perfect clear)
  const isBoardEmpty = state.grid.every((row) => row.every((cell) => !cell.filled));

  useEffect(() => {
    if (isBoardEmpty && state.status === "playing") {
      setAnimating(true);
    }
  }, [isBoardEmpty, state.status]);

  if (!animating) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: "none", zIndex: 100 }]}>
      {Array.from({ length: GRID_SIZE }).map((_, r) =>
        Array.from({ length: GRID_SIZE }).map((_, c) => (
          <IntroCell
            key={`${r}-${c}`}
            row={r}
            col={c}
            cellSize={cellSize}
            cellGap={cellGap}
            onComplete={() => {
              // Wait for the very last block in the wave to finish disappearing
              if (r === GRID_SIZE - 1 && c === GRID_SIZE - 1) {
                setAnimating(false);
              }
            }}
          />
        ))
      )}
    </View>
  );
}

function IntroCell({ row, col, cellSize, cellGap, onComplete }: any) {
  const scale = useSharedValue(0);
  const { radius, bevelLight, bevelDark } = getProportionalBevel(cellSize);
  
  // Diagonal color stripes
  const color = COLORS[(row + col) % COLORS.length]!;
  
  useEffect(() => {
    const fillDelay = (row + col) * 40;
    const holdTime = 600;
    
    scale.value = withSequence(
      withDelay(
        fillDelay, 
        withTiming(1, { duration: 250, easing: Easing.out(Easing.back(1.5)) })
      ),
      withDelay(
        holdTime, 
        withTiming(0, { duration: 150, easing: Easing.in(Easing.quad) }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const step = cellSize + cellGap;

  return (
    <Animated.View
      className={`${BLOCK_COLOR_CLASSES[color]} overflow-hidden`}
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
          borderTopColor: BEVEL_COLORS.top,
          borderLeftColor: BEVEL_COLORS.left,
          borderBottomColor: BEVEL_COLORS.bottom,
          borderRightColor: BEVEL_COLORS.right,
        },
        style,
      ]}
    />
  );
}
