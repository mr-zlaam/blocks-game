/** Points awarded per cleared line. */
const POINTS_PER_LINE = 10;

/** Maximum combo multiplier cap. */
const MAX_MULTIPLIER = 3.5;

/** Number of turns without a clear before combo fully resets. */
const COMBO_RESET_TURNS = 3;

/** Number of turns without a clear before combo is halved. */
const COMBO_HALVE_TURNS = 2;

/**
 * Returns the score multiplier for the current combo count.
 *
 * Combo 1–3:  ×1.0, ×1.5, ×2.0  (linear growth)
 * Combo 4–6:  ×2.3, ×2.6, ×2.8  (slowing)
 * Combo 7–10: ×3.0–3.3          (plateau)
 * Combo 10+:  ×3.5 cap
 */
export function getComboMultiplier(combo: number): number {
  if (combo <= 0) return 1;
  if (combo <= 3) return 1 + (combo - 1) * 0.5;
  if (combo <= 6) return 2 + (combo - 3) * 0.3;
  if (combo <= 10) return 3 + (combo - 7) * 0.1;
  return MAX_MULTIPLIER;
}

/** Calculates score gained from clearing lines with the current combo. */
export function calculateLineScore(
  linesCleared: number,
  combo: number,
): number {
  return Math.round(linesCleared * POINTS_PER_LINE * getComboMultiplier(combo));
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
