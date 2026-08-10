import { BLOCK_COLORS, GRID_SIZE } from "./types";
import { SHAPES_BY_TIER } from "./shapes";
import { canPlaceShape, getBoardFill } from "./grid";

import type {
  BlockColor,
  DifficultyTier,
  GamePiece,
  GameState,
  Grid,
  ShapeDefinition,
} from "./types";

/** Weight table: [tier1%, tier2%, tier3%, tier4%, tier5%] per bracket. */
const WEIGHT_TABLE: readonly (readonly number[])[] = [
  [60, 30, 10, 0, 0],   // DS 0–30:   honeymoon
  [35, 35, 25, 5, 0],   // DS 31–80:  learning
  [15, 30, 35, 15, 5],  // DS 81–150: mid-game
  [5, 20, 35, 30, 10],  // DS 151–250: sweat
  [0, 10, 30, 35, 25],  // DS 251+:   survival
];

const TIERS: readonly DifficultyTier[] = [1, 2, 3, 4, 5];

/** Calculate difficulty score from game state. */
export function calculateDifficultyScore(state: GameState): number {
  const fill = getBoardFill(state.grid);
  const fillPenalty = fill > 0.7 ? (fill - 0.7) * 100 : 0;
  return (
    state.piecesPlaced * 0.3 +
    state.totalLinesCleared * 0.5 +
    state.totalCombos * 1.0 +
    state.score * 0.01 -
    fillPenalty
  );
}

function getDifficultyBracket(ds: number): number {
  if (ds <= 30) return 0;
  if (ds <= 80) return 1;
  if (ds <= 150) return 2;
  if (ds <= 250) return 3;
  return 4;
}

/** Pick a random shape using weighted tier selection. */
function pickWeightedShape(ds: number): ShapeDefinition {
  const bracket = getDifficultyBracket(ds);
  const weights = WEIGHT_TABLE[bracket] ?? WEIGHT_TABLE[0]!;
  const roll = Math.random() * 100;

  let cumulative = 0;
  for (let i = 0; i < TIERS.length; i++) {
    cumulative += weights[i] ?? 0;
    if (roll < cumulative) {
      const tier = TIERS[i]!;
      const shapes = SHAPES_BY_TIER[tier];
      return shapes[Math.floor(Math.random() * shapes.length)]!;
    }
  }

  // Fallback: tier 1
  const fallback = SHAPES_BY_TIER[1];
  return fallback[Math.floor(Math.random() * fallback.length)]!;
}

/** Pick a random color. */
function pickRandomColor(): BlockColor {
  return BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)]!;
}

/** Check if a single piece can fit anywhere on the grid. */
function canPieceFit(grid: Grid, shape: ShapeDefinition): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (canPlaceShape(grid, shape, r, c)) return true;
    }
  }
  return false;
}

/**
 * Apply mercy algorithm: ensure at least 1 piece can be placed.
 * If none fit, swap the smallest piece for a Tier 1 shape that fits.
 */
function applyMercy(grid: Grid, pieces: GamePiece[]): GamePiece[] {
  const anyFits = pieces.some((p) => canPieceFit(grid, p.shape));
  if (anyFits) return pieces;

  // Find a Tier 1 shape that fits
  const easyShapes = SHAPES_BY_TIER[1];
  for (const shape of easyShapes) {
    if (canPieceFit(grid, shape)) {
      // Replace the smallest piece (index 0 for simplicity)
      const updated = [...pieces];
      updated[0] = { shape, color: pickRandomColor(), isPlaced: false };
      return updated;
    }
  }

  // Nothing fits at all → game over is legitimate
  return pieces;
}

/** Generate a set of 3 pieces based on difficulty, with mercy check. */
export function generatePieceSet(grid: Grid, ds: number): GamePiece[] {
  const pieces: GamePiece[] = Array.from({ length: 3 }, () => ({
    shape: pickWeightedShape(ds),
    color: pickRandomColor(),
    isPlaced: false,
  }));

  return applyMercy(grid, pieces);
}
