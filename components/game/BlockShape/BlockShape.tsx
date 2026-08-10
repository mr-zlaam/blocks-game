import { View } from "react-native";

import BlockCell from "./BlockCell";
import { BLOCK_COLOR_CLASSES, CELL_GAP, DEFAULT_CELL_SIZE } from "./styles";

import type { BlockShapeProps } from "./types";

/**
 * Renders a block shape from its definition.
 * Lays out a grid of `BlockCell` components based on the shape's boolean grid.
 */
export default function BlockShape({
  shape,
  color,
  cellSize = DEFAULT_CELL_SIZE,
}: BlockShapeProps) {
  const colorClass = BLOCK_COLOR_CLASSES[color];

  return (
    <View style={{ gap: CELL_GAP }}>
      {shape.grid.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: "row", gap: CELL_GAP }}>
          {row.map((isFilled, colIndex) => (
            <BlockCell
              key={colIndex}
              isFilled={isFilled}
              colorClass={colorClass}
              size={cellSize}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
