import { View } from "react-native";

import { BEVEL_COLORS, getProportionalBevel } from "./styles";

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

  const { radius, bevelLight, bevelDark } = getProportionalBevel(size);

  return (
    <View
      className={`${colorClass} overflow-hidden`}
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
    </View>
  );
}
