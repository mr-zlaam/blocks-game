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
  if (wouldScore) {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 300 }),
        withTiming(0.25, { duration: 300 }),
      ),
      -1, true,
    );
  } else {
    pulseOpacity.value = 0.35;
  }

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!hoverState) return null;

  const { row, col, shapeGrid, color } = hoverState;
  const step = cellSize + cellGap;
  const colorClass = BLOCK_COLOR_CLASSES[color];
  const cells: React.JSX.Element[] = [];

  for (let r = 0; r < shapeGrid.length; r++) {
    const shapeRow = shapeGrid[r];
    if (!shapeRow) continue;
    for (let c = 0; c < shapeRow.length; c++) {
      if (!shapeRow[c]) continue;
      const gr = row + r;
      const gc = col + c;
      if (gr < 0 || gr >= GRID_SIZE || gc < 0 || gc >= GRID_SIZE) continue;

      cells.push(
        <Animated.View
          key={`${r}-${c}`}
          className={`${colorClass} rounded-md`}
          style={[
            {
              position: "absolute",
              left: gc * step,
              top: gr * step,
              width: cellSize,
              height: cellSize,
            },
            pulseStyle,
            wouldScore && {
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
              elevation: 6,
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
