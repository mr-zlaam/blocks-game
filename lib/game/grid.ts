import { GRID_SIZE } from "./types";

import type { BlockColor, CellState, GamePiece, Grid, ShapeDefinition } from "./types";

/** Creates a fresh empty 8×8 grid. */
export function createEmptyGrid(): Grid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from<unknown, CellState>({ length: GRID_SIZE }, () => ({
      filled: false,
      color: null,
    })),
  );
}

/** Checks if a shape can be placed at (startRow, startCol) without overlap or out-of-bounds. */
export function canPlaceShape(
  grid: Grid,
  shape: ShapeDefinition,
  startRow: number,
  startCol: number,
): boolean {
  for (let r = 0; r < shape.grid.length; r++) {
    const row = shape.grid[r];
    if (!row) return false;
    for (let c = 0; c < row.length; c++) {
      if (!row[c]) continue;
      const gr = startRow + r;
      const gc = startCol + c;
      if (gr < 0 || gr >= GRID_SIZE || gc < 0 || gc >= GRID_SIZE) return false;
      if (grid[gr]?.[gc]?.filled) return false;
    }
  }
  return true;
}

/** Returns a new grid with the shape placed at (startRow, startCol). */
export function placeShape(
  grid: Grid,
  shape: ShapeDefinition,
  color: BlockColor,
  startRow: number,
  startCol: number,
): Grid {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  for (let r = 0; r < shape.grid.length; r++) {
    const row = shape.grid[r];
    if (!row) continue;
    for (let c = 0; c < row.length; c++) {
      if (!row[c]) continue;
      const target = newGrid[startRow + r]?.[startCol + c];
      if (target) {
        target.filled = true;
        target.color = color;
      }
    }
  }
  return newGrid;
}

/** Finds all fully completed rows and columns. */
export function findCompletedLines(grid: Grid): {
  rows: number[];
  cols: number[];
} {
  const rows: number[] = [];
  const cols: number[] = [];

  for (let r = 0; r < GRID_SIZE; r++) {
    const row = grid[r];
    if (row && row.every((cell) => cell.filled)) rows.push(r);
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let complete = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (!grid[r]?.[c]?.filled) {
        complete = false;
        break;
      }
    }
    if (complete) cols.push(c);
  }

  return { rows, cols };
}

/** Returns a new grid with the specified rows and columns cleared. */
export function clearLines(
  grid: Grid,
  rows: number[],
  cols: number[],
): Grid {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const rowSet = new Set(rows);
  const colSet = new Set(cols);

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (rowSet.has(r) || colSet.has(c)) {
        const cell = newGrid[r]?.[c];
        if (cell) {
          cell.filled = false;
          cell.color = null;
        }
      }
    }
  }
  return newGrid;
}

/** Checks if any unplaced piece can fit anywhere on the grid. */
export function canAnyPieceFit(grid: Grid, pieces: GamePiece[]): boolean {
  for (const piece of pieces) {
    if (piece.isPlaced) continue;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlaceShape(grid, piece.shape, r, c)) return true;
      }
    }
  }
  return false;
}

/** Returns the percentage of filled cells (0–1). */
export function getBoardFill(grid: Grid): number {
  let filled = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.filled) filled++;
    }
  }
  return filled / (GRID_SIZE * GRID_SIZE);
}
