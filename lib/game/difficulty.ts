import { BLOCK_COLORS, GRID_SIZE } from "./types";
import { SHAPES_BY_TIER } from "./shapes";
import { canPlaceShape, placeShape, findCompletedLines } from "./grid";

import type {
  BlockColor,
  DifficultyTier,
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
export function pickWeightedShape(score: number): ShapeDefinition {
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
export function pickRandomColor(): BlockColor {
  return BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)]!;
}

/** Check if a single piece can fit anywhere on the grid. */
export function canPieceFit(grid: Grid, shape: ShapeDefinition): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (canPlaceShape(grid, shape, r, c)) return true;
    }
  }
  return false;
}

/** Searches for a shape that can immediately clear a line. */
export function getHelpfulShape(grid: Grid): ShapeDefinition | null {
  for (const tier of [1, 2] as const) {
    const shapes = SHAPES_BY_TIER[tier];
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
