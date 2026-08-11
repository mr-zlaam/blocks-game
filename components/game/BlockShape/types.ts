import type { BlockColor, ShapeDefinition } from "@/lib/game";

/** Props for the BlockShape component. */
export interface BlockShapeProps {
  /** The shape definition to render. */
  shape: ShapeDefinition;
  /** Block color key from the theme. */
  color: BlockColor;
  /** Size of each cell in pixels. */
  cellSize?: number;
  /** Gap between cells in pixels. */
  cellGap?: number;
}

/** Props for a single BlockCell. */
export interface BlockCellProps {
  /** Whether this cell is filled (visible). */
  isFilled: boolean;
  /** NativeWind background class for the cell color. */
  colorClass: string;
  /** Size of the cell in pixels. */
  size: number;
}
