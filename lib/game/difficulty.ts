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
  [ 5, 25, 50, 20,  0],   // Score 0–10000:      Honeymoon (easy, fun shapes)
  [10, 25, 35, 20, 10],   // Score 10000–15000:  Warming up (gradual intro of harder)
  [15, 20, 30, 25, 10],   // Score 15000–20000:  Mid-game
  [10, 15, 25, 30, 20],   // Score 20000–30000:  Sweat
  [ 5, 10, 20, 35, 30],   // Score 30000+:       Survival
];

const TIERS: readonly DifficultyTier[] = [1, 2, 3, 4, 5];

export function calculateDifficultyScore(state: GameState): number {
  return state.score;
}

function getDifficultyBracket(score: number): number {
  if (score < 10000) return 0;
  if (score < 15000) return 1;
  if (score < 20000) return 2;
  if (score < 30000) return 3;
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
 * Ensure at least 2 out of 3 pieces can fit on the board.
 * Re-rolls any unfittable piece (up to MAX_REROLLS attempts) to find one that fits.
 * If the board is so full that we can't get 2 fittable pieces, we return what we have
 * and game over will trigger naturally.
 */
const MAX_REROLLS = 10;

function ensureMinFittable(
  grid: Grid,
  pieces: GamePiece[],
  score: number,
  minFit: number,
): GamePiece[] {
  const result = [...pieces];

  // Count how many currently fit
  let fittable = result.filter((p) => canPieceFit(grid, p.shape)).length;
  if (fittable >= minFit) return result;

  // Re-roll unfittable pieces one by one until we hit the target
  for (let i = 0; i < result.length && fittable < minFit; i++) {
    if (canPieceFit(grid, result[i]!.shape)) continue;

    // This piece doesn't fit — try re-rolling it
    for (let attempt = 0; attempt < MAX_REROLLS; attempt++) {
      const newShape = pickWeightedShape(score);
      if (canPieceFit(grid, newShape)) {
        result[i] = { shape: newShape, color: pickRandomColor(), isPlaced: false };
        fittable++;
        break;
      }
    }

    // If re-rolling with weighted shapes failed, try any shape from all tiers
    if (!canPieceFit(grid, result[i]!.shape)) {
      for (const tier of [2, 3, 1, 4, 5] as const) {
        const shapes = SHAPES_BY_TIER[tier];
        const shuffled = [...shapes].sort(() => Math.random() - 0.5);
        let found = false;
        for (const shape of shuffled) {
          if (canPieceFit(grid, shape)) {
            result[i] = { shape, color: pickRandomColor(), isPlaced: false };
            fittable++;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    }
  }

  return result;
}

/** Generate a set of 3 pieces based on difficulty, guaranteeing at least 2 can fit. */
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

  // Guarantee at least 2 out of 3 pieces can fit on the board
  return ensureMinFittable(grid, pieces, score, 2);
}

/**
 * Rescue pass: only triggers when ZERO remaining pieces can fit (game would end).
 * Swaps exactly ONE unfittable piece for a shape that fits, preferring
 * larger/harder shapes first so we don't just hand out dots.
 */
export function rescueUnfittablePieces(
  grid: Grid,
  pieces: GamePiece[],
  _score: number,
): GamePiece[] {
  // Check: can ANY remaining piece still fit?
  const anyFits = pieces.some((p) => !p.isPlaced && canPieceFit(grid, p.shape));

  // If at least one piece fits, don't touch anything — game can continue
  if (anyFits) return pieces;

  // None of the remaining pieces fit → swap exactly ONE for something that does
  const result = [...pieces];

  // Find the first unplaced piece to swap
  const swapIndex = result.findIndex((p) => !p.isPlaced);
  if (swapIndex === -1) return pieces;

  // Try larger shapes first (tier 3 → 2 → 1) to avoid cheap dots
  for (const tier of [3, 2, 1, 4, 5] as const) {
    const shapes = SHAPES_BY_TIER[tier];
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    for (const shape of shuffled) {
      if (canPieceFit(grid, shape)) {
        result[swapIndex] = { shape, color: pickRandomColor(), isPlaced: false };
        return result;
      }
    }
  }

  // Truly nothing fits → board is full, game over will trigger naturally
  return pieces;
}
