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
import { SPRING_BOUNCE } from "@/lib/animations";
import { GRID_SIZE, canPlaceShape } from "@/lib/game";
import { useGame } from "@/contexts/GameContext";

import type { GamePiece } from "@/lib/game";

/** Cell size used for pieces in the tray. */
const TRAY_CELL_SIZE = 22;

/** Y offset — piece floats above finger so you can see it. */
const FINGER_OFFSET_Y = -50;

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

  // Compute exact scale to match board cell size (in useEffect, not render)
  useEffect(() => {
    const layout = boardLayoutRef.current;
    if (layout) {
      scaleTarget.value = layout.cellSize / TRAY_CELL_SIZE;
    }
  }, [boardLayoutRef, scaleTarget]);

  useEffect(() => {
    lastHoverRef.current = "";
  }, [piece.isPlaced]);

  const handleMove = useCallback(
    (absX: number, absY: number) => {
      const layout = boardLayoutRef.current;
      if (!layout) return;

      const step = layout.cellSize + layout.cellGap;
      // Center the shape on the finger, not anchor to top-left
      const shapeH = piece.shape.grid.length;
      const shapeW = piece.shape.grid[0]?.length ?? 1;
      const col = Math.floor((absX - layout.x) / step - shapeW / 2 + 0.5);
      const row = Math.floor((absY + FINGER_OFFSET_Y - layout.y) / step - shapeH / 2 + 0.5);
      const key = `${row},${col}`;

      if (key === lastHoverRef.current) return;
      lastHoverRef.current = key;

      // Only show ghost if placement is valid (no overlaps, in bounds)
      const isValid = canPlaceShape(state.grid, piece.shape, row, col);
      if (isValid) {
        setHoverState({
          row, col, isValid: true,
          shapeGrid: piece.shape.grid,
          color: piece.color,
        });
      } else {
        setHoverState(null);
      }
    },
    [boardLayoutRef, state.grid, piece.shape, piece.color, setHoverState],
  );

  const handleDrop = useCallback(
    (absX: number, absY: number) => {
      setHoverState(null);
      lastHoverRef.current = "";

      const layout = boardLayoutRef.current;
      if (!layout) return;

      const step = layout.cellSize + layout.cellGap;
      const shapeH = piece.shape.grid.length;
      const shapeW = piece.shape.grid[0]?.length ?? 1;
      const col = Math.floor((absX - layout.x) / step - shapeW / 2 + 0.5);
      const row = Math.floor((absY + FINGER_OFFSET_Y - layout.y) / step - shapeH / 2 + 0.5);

      // Auto-snap: try exact, then clamped positions
      const cRow = Math.max(0, Math.min(GRID_SIZE - 1, row));
      const cCol = Math.max(0, Math.min(GRID_SIZE - 1, col));
      const positions = [
        { r: row, c: col },
        { r: cRow, c: cCol },
        { r: cRow, c: col },
        { r: row, c: cCol },
      ];

      for (const pos of positions) {
        if (canPlaceShape(state.grid, piece.shape, pos.r, pos.c)) {
          dispatch({ type: "PLACE_PIECE", row: pos.r, col: pos.c, pieceIndex: index });
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          return;
        }
      }
    },
    [boardLayoutRef, state.grid, piece.shape, dispatch, index, setHoverState],
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      scale.value = withSpring(scaleTarget.value, { damping: 14, stiffness: 200 });
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
      translateX.value = withSpring(0, SPRING_BOUNCE);
      translateY.value = withSpring(0, SPRING_BOUNCE);
      scale.value = withSpring(1, SPRING_BOUNCE);
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
