import type { ShapeDefinition } from "./types";

/** Points awarded per cleared line (base). */
const POINTS_PER_LINE = 100;

/** Maximum combo multiplier cap. */
const MAX_MULTIPLIER = 10;

/** Number of turns without a clear before combo fully resets. */
const COMBO_RESET_TURNS = 3;

/** Number of turns without a clear before combo is halved. */
const COMBO_HALVE_TURNS = 2;

/**
 * Returns the score multiplier for the current combo count.
 * Grows steadily up to 15x.
 */
export function getComboMultiplier(combo: number): number {
  if (combo <= 0) return 1;
  const multiplier = 1 + (combo - 1) * 0.8;
  return Math.min(multiplier, MAX_MULTIPLIER);
}

/** Calculates score gained from clearing lines with the current combo. */
export function calculateLineScore(
  linesCleared: number,
  combo: number,
): number {
  if (linesCleared === 0) return 0;
  // Exponential multi-line scaling (1 line = 1x, 2 lines = 2.5x, 3 lines = 4x, etc.)
  const multiLineMultiplier = 1 + (linesCleared - 1) * 1.5;
  const baseScore = linesCleared * POINTS_PER_LINE * multiLineMultiplier;
  return Math.round(baseScore * getComboMultiplier(combo));
}

/** Calculates base points just for placing a piece on the board. */
export function calculatePieceScore(shape: ShapeDefinition): number {
  let blocks = 0;
  for (let r = 0; r < shape.grid.length; r++) {
    const row = shape.grid[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      if (row[c]) blocks++;
    }
  }
  return blocks * 10; // 10 points per block
}

/**
 * Updates combo state after a turn.
 * - Clear → combo +1, reset miss counter
 * - Miss 1 turn → grace (combo maintained)
 * - Miss 2 turns → combo halved
 * - Miss 3 turns → combo resets to 0
 */
export function updateCombo(
  currentCombo: number,
  turnsWithoutClear: number,
  didClear: boolean,
): { combo: number; turnsWithoutClear: number } {
  if (didClear) {
    return { combo: currentCombo + 1, turnsWithoutClear: 0 };
  }

  const newTurns = turnsWithoutClear + 1;

  if (newTurns >= COMBO_RESET_TURNS) {
    return { combo: 0, turnsWithoutClear: newTurns };
  }
  if (newTurns >= COMBO_HALVE_TURNS) {
    return { combo: Math.floor(currentCombo / 2), turnsWithoutClear: newTurns };
  }
  return { combo: currentCombo, turnsWithoutClear: newTurns };
}
