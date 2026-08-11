import {
  createEmptyGrid,
  placeShape,
  findCompletedLines,
  clearLines,
  canAnyPieceFit,
  canPlaceShape,
  calculateLineScore,
  updateCombo,
  calculateDifficultyScore,
  generatePieceSet,
} from "@/lib/game";

import type { GameState, GameAction } from "@/lib/game";

/** Initial state before a game starts. */
export const INITIAL_STATE: GameState = {
  grid: createEmptyGrid(),
  pieces: [],
  selectedPieceIndex: null,
  score: 0,
  highScore: 0,
  combo: 0,
  turnsWithoutClear: 0,
  piecesPlaced: 0,
  totalLinesCleared: 0,
  totalCombos: 0,
  status: "playing",
  lastClearedLines: null,
};

/** Core game reducer — handles all game state transitions. */
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
    case "NEW_GAME": {
      const grid = createEmptyGrid();
      return {
        ...INITIAL_STATE,
        grid,
        pieces: generatePieceSet(grid, 0),
        highScore: state.highScore,
        status: "playing",
      };
    }

    case "SELECT_PIECE": {
      if (state.status !== "playing") return state;
      const piece = state.pieces[action.index];
      if (!piece || piece.isPlaced) return state;
      const idx = state.selectedPieceIndex === action.index ? null : action.index;
      return { ...state, selectedPieceIndex: idx };
    }

    case "PLACE_PIECE":
      return handlePlacePiece(state, action.row, action.col, action.pieceIndex);

    case "RESTORE_HIGH_SCORE":
      return { ...state, highScore: Math.max(state.highScore, action.highScore) };

    default:
      return state;
  }
}

function handlePlacePiece(state: GameState, row: number, col: number, pieceIndex: number): GameState {
  if (state.status !== "playing") return state;

  const piece = state.pieces[pieceIndex];
  if (!piece || piece.isPlaced) return state;

  if (!canPlaceShape(state.grid, piece.shape, row, col)) return state;

  // 1. Place the piece
  let newGrid = placeShape(state.grid, piece.shape, piece.color, row, col);

  // 2. Check for completed lines
  const completed = findCompletedLines(newGrid);
  const linesCleared = completed.rows.length + completed.cols.length;

  if (linesCleared > 0) {
    newGrid = clearLines(newGrid, completed.rows, completed.cols);
  }

  // 3. Update combo & score
  const comboResult = updateCombo(state.combo, state.turnsWithoutClear, linesCleared > 0);
  const scoreGain = linesCleared > 0 ? calculateLineScore(linesCleared, comboResult.combo) : 0;
  const newScore = state.score + scoreGain;

  // 4. Mark piece as placed
  const newPieces = state.pieces.map((p, i) =>
    i === pieceIndex ? { ...p, isPlaced: true } : p,
  );

  // 5. If all 3 placed, generate new set
  const allPlaced = newPieces.every((p) => p.isPlaced);
  const newPiecesPlaced = state.piecesPlaced + 1;
  const ds = calculateDifficultyScore({ ...state, piecesPlaced: newPiecesPlaced });
  const nextPieces = allPlaced ? generatePieceSet(newGrid, ds) : newPieces;

  // 6. Check game over
  const canContinue = canAnyPieceFit(newGrid, nextPieces);

  return {
    ...state,
    grid: newGrid,
    pieces: nextPieces,
    selectedPieceIndex: null,
    score: newScore,
    highScore: Math.max(newScore, state.highScore),
    combo: comboResult.combo,
    turnsWithoutClear: comboResult.turnsWithoutClear,
    piecesPlaced: newPiecesPlaced,
    totalLinesCleared: state.totalLinesCleared + linesCleared,
    totalCombos: linesCleared > 0 ? state.totalCombos + 1 : state.totalCombos,
    status: canContinue ? "playing" : "game_over",
    lastClearedLines: linesCleared > 0 ? completed : null,
  };
}
