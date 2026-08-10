import { View } from "react-native";

import { BEVEL, BEVEL_COLORS, BLOCK_COLOR_CLASSES } from "@/components/game/BlockShape/styles";

import type { BlockColor } from "@/lib/game";

interface BoardCellProps {
  filled: boolean;
  color: BlockColor | null;
  size: number;
}

/** A single cell on the game board. Empty = subtle grid square, filled = 3D block. */
export default function BoardCell({ filled, color, size }: BoardCellProps) {
  if (!filled || !color) {
    return (
      <View
        className="bg-surface-elevated rounded-md"
        style={{
          width: size,
          height: size,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.04)",
        }}
      />
    );
  }

  return (
    <View
      className={`${BLOCK_COLOR_CLASSES[color]} overflow-hidden`}
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        borderTopWidth: BEVEL.top,
        borderLeftWidth: BEVEL.left,
        borderBottomWidth: BEVEL.bottom,
        borderRightWidth: BEVEL.right,
        borderTopColor: BEVEL_COLORS.top,
        borderLeftColor: BEVEL_COLORS.left,
        borderBottomColor: BEVEL_COLORS.bottom,
        borderRightColor: BEVEL_COLORS.right,
      }}
    >
      <View
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "45%",
          backgroundColor: "rgba(255, 255, 255, 0.13)",
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "30%",
          backgroundColor: "rgba(0, 0, 0, 0.08)",
        }}
      />
    </View>
  );
}
