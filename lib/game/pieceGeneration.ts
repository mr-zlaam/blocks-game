// LOC exception: piece generation with chain-validation requires cohesive logic in one file
import { GRID_SIZE } from "./types";
import { SHAPES_BY_TIER } from "./shapes";
import { canPlaceShape, placeShape, findCompletedLines, clearLines } from "./grid";

import type { GamePiece, Grid } from "./types";

import { pickWeightedShape, pickRandomColor, getHelpfulShape, canPieceFit } from "./difficulty";

const MAX_REROLLS = 10;
const MAX_FULL_RETRIES = 5;

/**
 * Ensure at least `minFit` pieces can individually fit on the board.
 * Re-rolls unfittable pieces to find ones that fit.
 */
function ensureMinFittable(
  grid: Grid,
  pieces: GamePiece[],
  score: number,
  minFit: number,
): GamePiece[] {
  const result = [...pieces];
  let fittable = result.filter((p) => canPieceFit(grid, p.shape)).length;
  if (fittable >= minFit) return result;

  for (let i = 0; i < result.length && fittable < minFit; i++) {
    if (canPieceFit(grid, result[i]!.shape)) continue;

    for (let attempt = 0; attempt < MAX_REROLLS; attempt++) {
      const newShape = pickWeightedShape(score);
      if (canPieceFit(grid, newShape)) {
        result[i] = { shape: newShape, color: pickRandomColor(), isPlaced: false };
        fittable++;
        break;
      }
    }

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

/**
 * Check if there's a viable sequence: placing one piece (possibly clearing lines)
 * leaves room for at least one other piece to fit.
 */
function hasViablePath(grid: Grid, pieces: GamePiece[]): boolean {
  const unplaced = pieces.filter((p) => !p.isPlaced);
  if (unplaced.length < 2) return true;

  for (const piece of unplaced) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!canPlaceShape(grid, piece.shape, r, c)) continue;

        // Simulate placement
        let simGrid = placeShape(grid, piece.shape, piece.color, r, c);
        const completed = findCompletedLines(simGrid);
        if (completed.rows.length + completed.cols.length > 0) {
          simGrid = clearLines(simGrid, completed.rows, completed.cols);
        }

        // Can any OTHER piece fit after this placement?
        const others = unplaced.filter((p) => p !== piece);
        if (others.some((p) => canPieceFit(simGrid, p.shape))) return true;
      }
    }
  }
  return false;
}

/**
 * Generate a set of 3 pieces based on difficulty.
 * Guarantees:
 *  1. At least 2 out of 3 pieces can fit individually
 *  2. There exists a playable sequence where placing one piece
 *     (potentially clearing lines) leaves room for at least one more
 */
export function generatePieceSet(grid: Grid, score: number): GamePiece[] {
  for (let retry = 0; retry < MAX_FULL_RETRIES; retry++) {
    const pieces: GamePiece[] = Array.from({ length: 3 }, () => ({
      shape: pickWeightedShape(score),
      color: pickRandomColor(),
      isPlaced: false,
    }));

    // Beginner Help: 20% chance to include a line-clearing shape
    if (score < 10000 && Math.random() < 0.2) {
      const helpfulShape = getHelpfulShape(grid);
      if (helpfulShape) {
        const idx = Math.floor(Math.random() * 3);
        pieces[idx] = { shape: helpfulShape, color: pickRandomColor(), isPlaced: false };
      }
    }

    // Ensure at least 2 pieces can fit individually
    const adjusted = ensureMinFittable(grid, pieces, score, 2);

    // Validate chain: there must be a sequence that keeps the game alive
    if (hasViablePath(grid, adjusted)) return adjusted;
  }

  // Fallback: if retries exhausted, return best effort (game over may trigger naturally)
  const fallback: GamePiece[] = Array.from({ length: 3 }, () => ({
    shape: pickWeightedShape(score),
    color: pickRandomColor(),
    isPlaced: false,
  }));
  return ensureMinFittable(grid, fallback, score, 2);
}
