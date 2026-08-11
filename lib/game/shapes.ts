import type { DifficultyTier, ShapeDefinition } from "./types";

/**
 * Converts compact string patterns into a boolean grid.
 * "X" = filled, "." = empty.
 */
function shape(
  id: string,
  name: string,
  tier: DifficultyTier,
  pattern: readonly string[],
): ShapeDefinition {
  return {
    id,
    name,
    tier,
    grid: pattern.map((row) => [...row].map((c) => c === "X")),
  };
}

/* ── Tier 1 — Easy ─────────────────────────────────── */

const DOT = shape("dot", "Dot", 1, ["X"]);
const LINE_2H = shape("line_2h", "Line 2H", 1, ["XX"]);
const LINE_2V = shape("line_2v", "Line 2V", 1, ["X", "X"]);

/* ── Tier 2 — Medium ───────────────────────────────── */

const LINE_3H = shape("line_3h", "Line 3H", 2, ["XXX"]);
const LINE_3V = shape("line_3v", "Line 3V", 2, ["X", "X", "X"]);
const SQUARE_2 = shape("square_2", "Square 2×2", 2, ["XX", "XX"]);
const L_SM_1 = shape("l_sm_1", "L Small ↱", 2, ["X.", "XX"]);
const L_SM_2 = shape("l_sm_2", "L Small ↰", 2, [".X", "XX"]);
const L_SM_3 = shape("l_sm_3", "L Small ↲", 2, ["XX", "X."]);
const L_SM_4 = shape("l_sm_4", "L Small ↳", 2, ["XX", ".X"]);

/* ── Tier 3 — Hard ─────────────────────────────────── */

const LINE_4H = shape("line_4h", "Line 4H", 3, ["XXXX"]);
const LINE_4V = shape("line_4v", "Line 4V", 3, ["X", "X", "X", "X"]);
const T_UP = shape("t_up", "T Up", 3, ["XXX", ".X."]);
const T_DOWN = shape("t_down", "T Down", 3, [".X.", "XXX"]);
const T_LEFT = shape("t_left", "T Left", 3, ["X.", "XX", "X."]);
const T_RIGHT = shape("t_right", "T Right", 3, [".X", "XX", ".X"]);
const RECT_2X3 = shape("rect_2x3", "Rect 2×3", 3, ["XXX", "XXX"]);
const RECT_3X2 = shape("rect_3x2", "Rect 3×2", 3, ["XX", "XX", "XX"]);

/* ── Tier 4 — Very Hard ────────────────────────────── */

const LINE_5H = shape("line_5h", "Line 5H", 4, ["XXXXX"]);
const LINE_5V = shape("line_5v", "Line 5V", 4, ["X", "X", "X", "X", "X"]);
const L_BIG_1 = shape("l_big_1", "L Big ↱", 4, ["X..", "X..", "XXX"]);
const L_BIG_2 = shape("l_big_2", "L Big ↰", 4, ["..X", "..X", "XXX"]);
const L_BIG_3 = shape("l_big_3", "L Big ↲", 4, ["XXX", "X..", "X.."]);
const L_BIG_4 = shape("l_big_4", "L Big ↳", 4, ["XXX", "..X", "..X"]);
const SQUARE_3 = shape("square_3", "Square 3×3", 4, ["XXX", "XXX", "XXX"]);

/* ── Tier 5 — Nightmare ────────────────────────────── */

const S_SHAPE = shape("s_shape", "S Shape", 5, [".XX", "XX."]);
const Z_SHAPE = shape("z_shape", "Z Shape", 5, ["XX.", ".XX"]);
const CROSS = shape("cross", "Cross", 5, [".X.", "XXX", ".X."]);
const CORNER_BIG = shape("corner_big", "Corner Big", 5, ["XXX", "X..", "X.."]);

/** All shape definitions grouped by tier. */
export const SHAPES_BY_TIER: Record<DifficultyTier, readonly ShapeDefinition[]> = {
  1: [DOT, LINE_2H, LINE_2V],
  2: [LINE_3H, LINE_3V, SQUARE_2, L_SM_1, L_SM_2, L_SM_3, L_SM_4],
  3: [LINE_4H, LINE_4V, T_UP, T_DOWN, T_LEFT, T_RIGHT, RECT_2X3, RECT_3X2, SQUARE_3],
  4: [LINE_5H, LINE_5V, L_BIG_1, L_BIG_2, L_BIG_3, L_BIG_4],
  5: [S_SHAPE, Z_SHAPE, CROSS, CORNER_BIG],
};

/** Flat array of all shapes. */
export const ALL_SHAPES: readonly ShapeDefinition[] = [
  ...SHAPES_BY_TIER[1],
  ...SHAPES_BY_TIER[2],
  ...SHAPES_BY_TIER[3],
  ...SHAPES_BY_TIER[4],
  ...SHAPES_BY_TIER[5],
];
