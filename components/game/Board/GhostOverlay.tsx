import { View } from "react-native";

import { useGame } from "@/contexts/GameContext";
import { BLOCK_COLOR_CLASSES } from "@/components/game/BlockShape/styles";
import { GRID_SIZE } from "@/lib/game";

interface GhostOverlayProps {
  cellSize: number;
  cellGap: number;
}

/**
 * Renders a semi-transparent preview of where the dragged piece will land.
 * Green-tinted when valid, red-tinted when invalid.
 * Positioned absolutely over the board grid.
 */
export default function GhostOverlay({ cellSize, cellGap }: GhostOverlayProps) {
  const { hoverState } = useGame();

  if (!hoverState) return null;

  const { row, col, isValid, shapeGrid, color } = hoverState;
  const step = cellSize + cellGap;
  const colorClass = isValid ? BLOCK_COLOR_CLASSES[color] : "bg-danger";
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
        <View
          key={`${r}-${c}`}
          className={`${colorClass} rounded-md`}
          style={{
            position: "absolute",
            left: gc * step,
            top: gr * step,
            width: cellSize,
            height: cellSize,
            opacity: isValid ? 0.35 : 0.25,
          }}
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
