import type { BlockColor } from "@/lib/game";

/**
 * Maps block color keys to NativeWind background classes.
 * This is the single source of truth for block color styling.
 */
export const BLOCK_COLOR_CLASSES: Record<BlockColor, string> = {
  red: "bg-block-red",
  orange: "bg-block-orange",
  yellow: "bg-block-yellow",
  green: "bg-block-green",
  blue: "bg-block-blue",
  indigo: "bg-block-indigo",
  purple: "bg-block-purple",
  pink: "bg-block-pink",
  cyan: "bg-block-cyan",
};

/** Default cell size in pixels. */
export const DEFAULT_CELL_SIZE = 42;

/** Gap between cells in pixels. */
export const CELL_GAP = 3;

/** 3D bevel border widths. */
export const BEVEL = {
  top: 4,
  left: 3,
  bottom: 5,
  right: 3,
} as const;

/** 3D bevel border colors. */
export const BEVEL_COLORS = {
  top: "rgba(255, 255, 255, 0.40)",
  left: "rgba(255, 255, 255, 0.22)",
  bottom: "rgba(0, 0, 0, 0.40)",
  right: "rgba(0, 0, 0, 0.22)",
} as const;

/** Computes 3D bevel dimensions proportionally to cell size for perfect visual matching at any scale. */
export function getProportionalBevel(size: number) {
  return {
    radius: Math.max(2, Math.round(size * 0.22)),
    bevelLight: Math.max(1, Math.round(size * 0.11)),
    bevelDark: Math.max(1, Math.round(size * 0.14)),
  };
}
