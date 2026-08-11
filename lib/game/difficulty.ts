import { BLOCK_COLORS, GRID_SIZE } from "./types";
import { SHAPES_BY_TIER } from "./shapes";
import { canPlaceShape, placeShape, findCompletedLines } from "./grid";

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
  // [Tier 1, Tier 2, Tier 3, Tier 4, Tier 5] percentages
  [ 5, 25, 55, 15,  0],   // Score 0–5000:       Honeymoon (Very few dots, lots of T3/T4)
  [30, 35, 20, 10,  5],   // Score 5000–10000:   Learning
  [15, 25, 30, 20, 10],   // Score 10000–15000:  Mid-game
  [ 5, 15, 30, 30, 20],   // Score 15000–25000:  Sweat
  [ 0, 10, 25, 35, 30],   // Score 25000+:       Survival
];

const TIERS: readonly DifficultyTier[] = [1, 2, 3, 4, 5];

export function calculateDifficultyScore(state: GameState): number {
  return state.score;
}

function getDifficultyBracket(score: number): number {
  if (score < 5000) return 0;
  if (score < 10000) return 1;
  if (score < 15000) return 2;
  if (score < 25000) return 3;
  return 4;
}

/** Pick a random shape using weighted tier selection. */
function pickWeightedShape(score: number): ShapeDefinition {
  const bracket = getDifficultyBracket(score);
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
 * Searches for a shape that can immediately clear a line.
 */
function getHelpfulShape(grid: Grid): ShapeDefinition | null {
  // Only check simpler shapes (tier 1 and 2) to keep the board clean
  for (const tier of [1, 2] as const) {
    const shapes = SHAPES_BY_TIER[tier];
    // Shuffle shapes to avoid always giving the same helpful shape
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    for (const shape of shuffled) {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (canPlaceShape(grid, shape, r, c)) {
            const tempGrid = placeShape(grid, shape, "red", r, c);
            const cleared = findCompletedLines(tempGrid);
            if (cleared.rows.length > 0 || cleared.cols.length > 0) {
              return shape;
            }
          }
        }
      }
    }
  }
  return null;
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
      const updated = [...pieces];
      updated[0] = { shape, color: pickRandomColor(), isPlaced: false };
      return updated;
    }
  }

  return pieces;
}

/** Generate a set of 3 pieces based on difficulty, with mercy check and beginner help. */
export function generatePieceSet(grid: Grid, score: number): GamePiece[] {
  const pieces: GamePiece[] = Array.from({ length: 3 }, () => ({
    shape: pickWeightedShape(score),
    color: pickRandomColor(),
    isPlaced: false,
  }));

  // Beginner Help: If score < 5000, 20% chance to guarantee a helpful shape if one exists
  if (score < 5000 && Math.random() < 0.2) {
    const helpfulShape = getHelpfulShape(grid);
    if (helpfulShape) {
      // Replace a random piece with the helpful shape
      const idx = Math.floor(Math.random() * 3);
      pieces[idx] = { shape: helpfulShape, color: pickRandomColor(), isPlaced: false };
    }
  }

  return applyMercy(grid, pieces);
}
