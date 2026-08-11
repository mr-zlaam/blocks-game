import { useCallback, useRef, useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import { useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";

import { GRID_SIZE } from "@/lib/game";
import { useGame } from "@/contexts/GameContext";
import BoardCell from "./BoardCell";
import GhostOverlay from "./GhostOverlay";
import LineClearEffect from "./LineClearEffect";

import BoardIntroEffect from "./BoardIntroEffect";
import BoardGameOverEffect from "./BoardGameOverEffect";

const BOARD_PADDING = 6;
const CELL_GAP = 2;

/**
 * The 8×8 game board with ghost preview overlay.
 * Measures its absolute screen position so DraggablePiece
 * can calculate grid coordinates from drop position.
 */
export default function Board() {
  const { width } = useWindowDimensions();
  const { state, boardLayoutRef, hoverState } = useGame();
  const gridRef = useRef<View>(null);
  
  const pulseOpacity = useSharedValue(0);

  useEffect(() => {
    if (hoverState?.wouldScore) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 600 }),
          withTiming(0.15, { duration: 600 })
        ),
        -1, true
      );
    } else {
      pulseOpacity.value = 0;
    }
  }, [hoverState?.wouldScore, pulseOpacity]);

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
            {row.map((cell, colIndex) => {
              const isDoomedRow = hoverState?.completedLines?.rows.includes(rowIndex);
              const isDoomedCol = hoverState?.completedLines?.cols.includes(colIndex);
              const isDoomed = Boolean(hoverState?.wouldScore && (isDoomedRow || isDoomedCol) && cell.filled);

              return (
                <BoardCell
                  key={colIndex}
                  filled={cell.filled}
                  color={cell.color}
                  size={cellSize}
                  isDoomed={isDoomed}
                  glowOpacity={pulseOpacity}
                />
              );
            })}
          </View>
        ))}

        {/* Intro/Perfect Clear Animation */}
        <BoardIntroEffect cellSize={cellSize} cellGap={CELL_GAP} />

        {/* Game Over Fill Animation */}
        <BoardGameOverEffect cellSize={cellSize} cellGap={CELL_GAP} />

        {/* Ghost preview while dragging */}
        <GhostOverlay cellSize={cellSize} cellGap={CELL_GAP} />

        {/* Line clear flash animation */}
        <LineClearEffect cellSize={cellSize} cellGap={CELL_GAP} />
      </View>
    </View>
  );
}
