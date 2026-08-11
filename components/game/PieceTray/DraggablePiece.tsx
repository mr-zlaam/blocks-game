import { useCallback, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { playSound } from "@/lib/audio";

import { BlockShape } from "@/components/game/BlockShape";
import { canPlaceShape, placeShape, findCompletedLines } from "@/lib/game";
import { useGame } from "@/contexts/GameContext";

import type { GamePiece } from "@/lib/game";

/** Cell size used for pieces in the tray. */
const TRAY_CELL_SIZE = 22;

/** Y offset — piece floats above finger so you can see it. */
const FINGER_OFFSET_Y = -250;

/** Smooth snap-back spring (no bounce). */
const SPRING_SNAP = { damping: 30, stiffness: 400 };

interface DraggablePieceProps {
  piece: GamePiece;
  index: number;
}

export default function DraggablePiece({ piece, index }: DraggablePieceProps) {
  const { state, dispatch, boardLayoutRef, setHoverState } = useGame();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const scaleTarget = useSharedValue(1.8);
  const lastHoverRef = useRef<string>("");
  const pieceViewRef = useRef<View>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const layout = boardLayoutRef.current;
    if (layout) {
      scaleTarget.value = layout.cellSize / TRAY_CELL_SIZE;
    }
  }, [boardLayoutRef, scaleTarget]);
  // Reset shared values when a new piece arrives at this slot
  useEffect(() => {
    lastHoverRef.current = "";
    if (!piece.isPlaced) {
      scale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
    }
  }, [piece, scale, translateX, translateY]);

  /** Smoothly return piece to its tray position. */
  const resetToTray = useCallback(() => {
    translateX.value = withSpring(0, SPRING_SNAP);
    translateY.value = withSpring(0, SPRING_SNAP);
    scale.value = withSpring(1, SPRING_SNAP);
  }, [translateX, translateY, scale]);

  /** Measure piece center vs finger start to get correction offset. */
  const handleDragStart = useCallback(
    (fingerX: number, fingerY: number) => {
      pieceViewRef.current?.measureInWindow((px, py, pw, ph) => {
        offsetRef.current = {
          x: px + pw / 2 - fingerX,
          y: py + ph / 2 - fingerY,
        };
      });
    },
    [],
  );

  /** Compute grid position & exact continuous offsets from piece's ACTUAL visual center. */
  const toGridPos = useCallback(
    (absX: number, absY: number) => {
      const layout = boardLayoutRef.current;
      if (!layout) return null;

      const step = layout.cellSize + layout.cellGap;
      const shapeH = piece.shape.grid.length;
      const shapeW = piece.shape.grid[0]?.length ?? 1;

      // Piece visual center = finger + offset correction + finger offset
      const pieceCX = absX + offsetRef.current.x;
      const pieceCY = absY + offsetRef.current.y + FINGER_OFFSET_Y;

      const exactCol = (pieceCX - layout.x) / step - shapeW / 2;
      const exactRow = (pieceCY - layout.y) / step - shapeH / 2;

      const col = Math.round(exactCol);
      const row = Math.round(exactRow);

      return { row, col, exactRow, exactCol };
    },
    [boardLayoutRef, piece.shape],
  );

  /** Magnetic snap search: finds the closest valid placement slot within a magnetic radius. */
  const findNearestValidPos = useCallback(
    (absX: number, absY: number) => {
      const pos = toGridPos(absX, absY);
      if (!pos) return null;

      const { row, col, exactRow, exactCol } = pos;

      // 1. Direct match check
      if (canPlaceShape(state.grid, piece.shape, row, col)) {
        return { row, col };
      }

      // 2. Magnetic search in ±1 cell radius (3x3 neighborhood)
      let bestSlot: { row: number; col: number } | null = null;
      let minDistanceSq = 2.5; // Max snap radius (~1.5 cells)

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const r = row + dr;
          const c = col + dc;

          if (canPlaceShape(state.grid, piece.shape, r, c)) {
            const distSq = (r - exactRow) ** 2 + (c - exactCol) ** 2;
            if (distSq < minDistanceSq) {
              minDistanceSq = distSq;
              bestSlot = { row: r, col: c };
            }
          }
        }
      }

      return bestSlot;
    },
    [toGridPos, state.grid, piece.shape],
  );

  const handleMove = useCallback(
    (absX: number, absY: number) => {
      const target = findNearestValidPos(absX, absY);
      if (!target) {
        if (lastHoverRef.current !== "") {
          lastHoverRef.current = "";
          setHoverState(null);
        }
        return;
      }

      const key = `${target.row},${target.col}`;
      if (key === lastHoverRef.current) return;
      lastHoverRef.current = key;

      const tempGrid = placeShape(state.grid, piece.shape, piece.color, target.row, target.col);
      const completed = findCompletedLines(tempGrid);
      const wouldScore = completed.rows.length + completed.cols.length > 0;

      setHoverState({
        row: target.row,
        col: target.col,
        isValid: true,
        wouldScore,
        completedLines: completed,
        shapeGrid: piece.shape.grid,
        color: piece.color,
      });
    },
    [findNearestValidPos, state.grid, piece.shape, piece.color, setHoverState],
  );

  const handleDrop = useCallback(
    (absX: number, absY: number) => {
      setHoverState(null);
      lastHoverRef.current = "";

      const target = findNearestValidPos(absX, absY);
      if (target) {
        const tempGrid = placeShape(state.grid, piece.shape, piece.color, target.row, target.col);
        const completed = findCompletedLines(tempGrid);
        const willScore = completed.rows.length > 0 || completed.cols.length > 0;

        const layout = boardLayoutRef.current;
        if (layout) {
          const step = layout.cellSize + layout.cellGap;
          const shapeH = piece.shape.grid.length;
          const shapeW = piece.shape.grid[0]?.length ?? 1;

          // Target exact center coords on screen
          const targetCX = layout.x + (target.col + shapeW / 2) * step;
          const targetCY = layout.y + (target.row + shapeH / 2) * step;

          // Current piece center coords on screen
          const currentCX = absX + offsetRef.current.x;
          const currentCY = absY + offsetRef.current.y + FINGER_OFFSET_Y;

          // Vector distance to glide
          const diffX = targetCX - currentCX;
          const diffY = targetCY - currentCY;

          translateX.value = withTiming(translateX.value + diffX, { duration: 100, easing: Easing.out(Easing.quad) });
          translateY.value = withTiming(translateY.value + diffY, { duration: 100, easing: Easing.out(Easing.quad) }, (finished) => {
            if (finished) {
              runOnJS(dispatch)({ type: "PLACE_PIECE", row: target.row, col: target.col, pieceIndex: index });
              // We will just vibrate on placement, and if scoring, play clear
              runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
              if (willScore) {
                runOnJS(playSound)("clear");
              }
            }
          });
        } else {
          // Fallback if layout ref is missing (should never happen)
          dispatch({ type: "PLACE_PIECE", row: target.row, col: target.col, pieceIndex: index });
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        return;
      }

      // No valid position — spring back
      resetToTray();
    },
    [
      findNearestValidPos,
      dispatch,
      index,
      setHoverState,
      resetToTray,
      boardLayoutRef,
      piece.shape,
      piece.color,
      state.grid,
      translateX,
      translateY,
    ],
  );

  const panGesture = Gesture.Pan()
    .hitSlop({ top: 60, bottom: 60, left: 60, right: 60 })
    .onBegin(() => {
      // Just a subtle vibration when touching the piece
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    })
    .onStart((e) => {
      isDragging.value = true;
      scale.value = withTiming(scaleTarget.value, { 
        duration: 150, 
        easing: Easing.out(Easing.quad) 
      });
      runOnJS(handleDragStart)(e.absoluteX, e.absoluteY);
    })
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY + FINGER_OFFSET_Y;
      runOnJS(handleMove)(e.absoluteX, e.absoluteY);
    })
    .onEnd((e) => {
      runOnJS(handleDrop)(e.absoluteX, e.absoluteY);
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const shapeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 999 : 0,
    elevation: isDragging.value ? 10 : 0,
  }));

  if (piece.isPlaced) {
    return (
      <View className="flex-1 items-center justify-center py-4 opacity-20">
        <Text className="text-text-muted text-xs">✓</Text>
      </View>
    );
  }

  return (
    <View
      ref={pieceViewRef}
      className="flex-1 items-center justify-center py-4"
      style={{ overflow: "visible" }}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={shapeStyle}>
          <BlockShape shape={piece.shape} color={piece.color} cellSize={TRAY_CELL_SIZE} cellGap={1.5} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
