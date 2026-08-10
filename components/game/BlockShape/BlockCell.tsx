import { View } from "react-native";

import { BEVEL, BEVEL_COLORS } from "./styles";

import type { BlockCellProps } from "./types";

/**
 * A single cell within a block shape.
 * Renders as a 3D beveled, glossy block when filled.
 * Uses thick highlight borders (top/left) and shadow borders (bottom/right)
 * with an inner shine overlay for a premium game feel.
 */
export default function BlockCell({
  isFilled,
  colorClass,
  size,
}: BlockCellProps) {
  if (!isFilled) {
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <View
      className={`${colorClass} overflow-hidden`}
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
      {/* Glossy shine — top portion highlight */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "45%",
          backgroundColor: "rgba(255, 255, 255, 0.13)",
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      />
      {/* Inner depth — subtle bottom shadow */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          backgroundColor: "rgba(0, 0, 0, 0.08)",
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
        }}
      />
    </View>
  );
}
