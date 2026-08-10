import { useCallback, useRef } from "react";
import { View, useWindowDimensions } from "react-native";

import { GRID_SIZE } from "@/lib/game";
import { useGame } from "@/contexts/GameContext";
import BoardCell from "./BoardCell";
import GhostOverlay from "./GhostOverlay";

const BOARD_PADDING = 6;
const CELL_GAP = 2;

/**
 * The 8×8 game board with ghost preview overlay.
 * Measures its absolute screen position so DraggablePiece
 * can calculate grid coordinates from drop position.
 */
export default function Board() {
  const { width } = useWindowDimensions();
  const { state, boardLayoutRef } = useGame();
  const gridRef = useRef<View>(null);

  const boardInnerWidth = width - 16 * 2;
  const cellSize = Math.floor(
    (boardInnerWidth - BOARD_PADDING * 2 - (GRID_SIZE - 1) * CELL_GAP) /
      GRID_SIZE,
  );

  const handleLayout = useCallback(() => {
    gridRef.current?.measureInWindow((x, y) => {
      boardLayoutRef.current = { x, y, cellSize, cellGap: CELL_GAP };
    });
  }, [cellSize, boardLayoutRef]);

  return (
    <View
      className="bg-surface rounded-game-lg overflow-hidden self-center"
      style={{ padding: BOARD_PADDING }}
    >
      <View ref={gridRef} onLayout={handleLayout} style={{ gap: CELL_GAP }}>
        {state.grid.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: "row", gap: CELL_GAP }}>
            {row.map((cell, colIndex) => (
              <BoardCell
                key={colIndex}
                filled={cell.filled}
                color={cell.color}
                size={cellSize}
              />
            ))}
          </View>
        ))}

        {/* Ghost preview while dragging */}
        <GhostOverlay cellSize={cellSize} cellGap={CELL_GAP} />
      </View>
    </View>
  );
}
