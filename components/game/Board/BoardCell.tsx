import { View } from "react-native";

import { BEVEL_COLORS, BLOCK_COLOR_CLASSES, getProportionalBevel } from "@/components/game/BlockShape/styles";

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
        className="bg-surface rounded-md"
        style={{
          width: size,
          height: size,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.015)",
        }}
      />
    );
  }

  // Use the exact same proportional logic as BlockCell for pixel-perfect matching
  const { radius, bevelLight, bevelDark } = getProportionalBevel(size);

  return (
    <View
      className={`${BLOCK_COLOR_CLASSES[color]} overflow-hidden`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderTopWidth: bevelLight,
        borderLeftWidth: bevelLight,
        borderBottomWidth: bevelDark,
        borderRightWidth: bevelDark,
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
          borderTopLeftRadius: radius / 2,
          borderTopRightRadius: radius / 2,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "30%",
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          borderBottomLeftRadius: radius / 2,
          borderBottomRightRadius: radius / 2,
        }}
      />
    </View>
  );
}
