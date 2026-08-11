import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useGame } from "@/contexts/GameContext";
import { BLOCK_COLOR_CLASSES } from "@/components/game/BlockShape/styles";
import { GRID_SIZE } from "@/lib/game";

interface GhostOverlayProps {
  cellSize: number;
  cellGap: number;
}

/**
 * Renders ghost preview of where a dragged piece will land.
 * Pulses and glows when the placement would complete a line.
 */
export default function GhostOverlay({ cellSize, cellGap }: GhostOverlayProps) {
  const { hoverState } = useGame();
  const pulseOpacity = useSharedValue(0.35);

  // Pulse animation when wouldScore
  const wouldScore = hoverState?.wouldScore ?? false;
  
  useEffect(() => {
    if (wouldScore) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 600 }),
          withTiming(0.15, { duration: 600 }),
        ),
        -1, true,
      );
    } else {
      pulseOpacity.value = 0.35;
    }
  }, [wouldScore, pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!hoverState) return null;

  const { row, col, shapeGrid, color, completedLines } = hoverState;
  const step = cellSize + cellGap;
  const colorClass = BLOCK_COLOR_CLASSES[color];
  const cells: React.JSX.Element[] = [];
  const lineHighlights: React.JSX.Element[] = [];

  // Render full row/col highlights if about to score
  if (wouldScore && completedLines) {
    const boardSize = GRID_SIZE * step - cellGap;
    
    completedLines.rows.forEach((r) => {
      lineHighlights.push(
        <Animated.View
          key={`row-${r}`}
          style={[
            {
              position: "absolute",
              left: 0,
              top: r * step,
              width: boardSize,
              height: cellSize,
              backgroundColor: "white",
              borderRadius: 6,
            },
            pulseStyle,
          ]}
        />
      );
    });

    completedLines.cols.forEach((c) => {
      lineHighlights.push(
        <Animated.View
          key={`col-${c}`}
          style={[
            {
              position: "absolute",
              left: c * step,
              top: 0,
              width: cellSize,
              height: boardSize,
              backgroundColor: "white",
              borderRadius: 6,
            },
            pulseStyle,
          ]}
        />
      );
    });
  }

  for (let r = 0; r < shapeGrid.length; r++) {
    const shapeRow = shapeGrid[r];
    if (!shapeRow) continue;
    for (let c = 0; c < shapeRow.length; c++) {
      if (!shapeRow[c]) continue;
      const gr = row + r;
      const gc = col + c;
      if (gr < 0 || gr >= GRID_SIZE || gc < 0 || gc >= GRID_SIZE) continue;

      cells.push(
        <View
          key={`${r}-${c}`}
          className={`${colorClass} rounded-md opacity-35`}
          style={{
            position: "absolute",
            left: gc * step,
            top: gr * step,
            width: cellSize,
            height: cellSize,
          }}
        />,
      );
    }
  }

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
      {lineHighlights}
      {cells}
    </View>
  );
}
