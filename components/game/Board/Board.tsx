import { useCallback } from "react";
import { View, useWindowDimensions } from "react-native";

import { GRID_SIZE } from "@/lib/game";
import { useGame } from "@/contexts/GameContext";
import BoardCell from "./BoardCell";

const BOARD_PADDING = 16;
const CELL_GAP = 2;

/**
 * The 8×8 game board. Calculates cell size dynamically to fit screen width.
 * Tapping an empty cell places the currently selected piece.
 */
export default function Board() {
  const { width } = useWindowDimensions();
  const { state, dispatch } = useGame();

  const boardInnerWidth = width - BOARD_PADDING * 2;
  const cellSize = Math.floor(
    (boardInnerWidth - (GRID_SIZE - 1) * CELL_GAP) / GRID_SIZE,
  );

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      dispatch({ type: "PLACE_PIECE", row, col });
    },
    [dispatch],
  );

  return (
    <View
      className="bg-surface rounded-game-lg overflow-hidden self-center"
      style={{ padding: 6 }}
    >
      <View style={{ gap: CELL_GAP }}>
        {state.grid.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row", gap: CELL_GAP }}>
            {row.map((cell, colIndex) => (
              <BoardCell
                key={colIndex}
                filled={cell.filled}
                color={cell.color}
                size={cellSize}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
