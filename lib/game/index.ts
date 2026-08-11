export type {
  ShapeDefinition,
  DifficultyTier,
  BlockColor,
  CellState,
  Grid,
  GamePiece,
  GameState,
  GameAction,
  GameStatus,
} from "./types";

export { BLOCK_COLORS, GRID_SIZE } from "./types";
export { ALL_SHAPES, SHAPES_BY_TIER } from "./shapes";

export {
  createEmptyGrid,
  canPlaceShape,
  placeShape,
  findCompletedLines,
  clearLines,
  canAnyPieceFit,
  getBoardFill,
} from "./grid";

export {
  calculateLineScore,
  calculatePieceScore,
  getComboMultiplier,
  updateCombo,
} from "./scoring";
export { calculateDifficultyScore, generatePieceSet } from "./difficulty";
