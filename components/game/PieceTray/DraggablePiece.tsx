import { useCallback, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { BlockShape } from "@/components/game/BlockShape";
import { GRID_SIZE, canPlaceShape } from "@/lib/game";
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

  useEffect(() => {
    lastHoverRef.current = "";
  }, [piece.isPlaced]);

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

  /** Compute grid position from piece's ACTUAL visual center (not finger). */
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

      const col = Math.round((pieceCX - layout.x) / step - shapeW / 2);
      const row = Math.round((pieceCY - layout.y) / step - shapeH / 2);

      return { row, col };
    },
    [boardLayoutRef, piece.shape],
  );

  const handleMove = useCallback(
    (absX: number, absY: number) => {
      const pos = toGridPos(absX, absY);
      if (!pos) return;

      const key = `${pos.row},${pos.col}`;
      if (key === lastHoverRef.current) return;
      lastHoverRef.current = key;

      const isValid = canPlaceShape(state.grid, piece.shape, pos.row, pos.col);
      if (isValid) {
        setHoverState({
          row: pos.row, col: pos.col, isValid: true,
          shapeGrid: piece.shape.grid,
          color: piece.color,
        });
      } else {
        setHoverState(null);
      }
    },
    [toGridPos, state.grid, piece.shape, piece.color, setHoverState],
  );

  const handleDrop = useCallback(
    (absX: number, absY: number) => {
      setHoverState(null);
      lastHoverRef.current = "";

      const pos = toGridPos(absX, absY);
      if (!pos) return;

      // Auto-snap: try exact, then clamped
      const cRow = Math.max(0, Math.min(GRID_SIZE - 1, pos.row));
      const cCol = Math.max(0, Math.min(GRID_SIZE - 1, pos.col));
      const tries = [
        pos,
        { row: cRow, col: cCol },
        { row: cRow, col: pos.col },
        { row: pos.row, col: cCol },
      ];

      for (const t of tries) {
        if (canPlaceShape(state.grid, piece.shape, t.row, t.col)) {
          dispatch({ type: "PLACE_PIECE", row: t.row, col: t.col, pieceIndex: index });
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          return;
        }
      }
    },
    [toGridPos, state.grid, piece.shape, dispatch, index, setHoverState],
  );

  const panGesture = Gesture.Pan()
    .hitSlop({ top: 60, bottom: 60, left: 60, right: 60 })
    .onStart((e) => {
      isDragging.value = true;
      scale.value = withSpring(scaleTarget.value, { damping: 18, stiffness: 250 });
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
      translateX.value = withSpring(0, SPRING_SNAP);
      translateY.value = withSpring(0, SPRING_SNAP);
      scale.value = withSpring(1, SPRING_SNAP);
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
          <BlockShape shape={piece.shape} color={piece.color} cellSize={TRAY_CELL_SIZE} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
