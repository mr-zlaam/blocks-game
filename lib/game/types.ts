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
  /** Unique shape identifier. */
  readonly id: string;
  /** Human-readable name. */
  readonly name: string;
  /** 2D grid where `true` = filled cell. */
  readonly grid: readonly (readonly boolean[])[];
  /** Difficulty tier (1 = easy, 5 = nightmare). */
  readonly tier: DifficultyTier;
}

/** The list of all block color keys for random assignment. */
export const BLOCK_COLORS: readonly BlockColor[] = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
  "cyan",
] as const;
