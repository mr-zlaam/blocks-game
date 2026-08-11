/** Difficulty tier for a shape — higher = harder to place. */
export type DifficultyTier = 1 | 2 | 3 | 4 | 5;

/** Block color keys matching the theme's `block.*` tokens. */
export type BlockColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "cyan";

/** A shape definition — the blueprint for a placeable piece. */
export interface ShapeDefinition {
  readonly id: string;
  readonly name: string;
  readonly grid: readonly (readonly boolean[])[];
  readonly tier: DifficultyTier;
}

/** The list of all block color keys. */
export const BLOCK_COLORS: readonly BlockColor[] = [
  "red", "orange", "yellow", "green", "blue",
  "indigo", "purple", "pink", "cyan",
] as const;

/** Grid dimensions. */
export const GRID_SIZE = 8;

/** State of a single cell on the board. */
export interface CellState {
  filled: boolean;
  color: BlockColor | null;
}

/** 8×8 game grid. */
export type Grid = CellState[][];

/** A game piece — shape + assigned color + placement status. */
export interface GamePiece {
  shape: ShapeDefinition;
  color: BlockColor;
  isPlaced: boolean;
}

/** Overall game status. */
export type GameStatus = "playing" | "game_over";

/** Full game state. */
export interface GameState {
  grid: Grid;
  pieces: GamePiece[];
  selectedPieceIndex: number | null;
  score: number;
  highScore: number;
  combo: number;
  turnsWithoutClear: number;
  piecesPlaced: number;
  totalLinesCleared: number;
  totalCombos: number;
  status: GameStatus;
  /** Rows/cols cleared on last placement — drives clear animation. */
  lastClearedLines: { rows: number[]; cols: number[] } | null;
}

/** Actions the player can take. */
export type GameAction =
  | { type: "START_GAME" }
  | { type: "SELECT_PIECE"; index: number }
  | { type: "PLACE_PIECE"; row: number; col: number; pieceIndex: number }
  | { type: "RESTORE_HIGH_SCORE"; highScore: number }
  | { type: "NEW_GAME" };
