import { Pressable, View, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { BlockShape } from "@/components/game/BlockShape";
import { SPRING_PRESS, SPRING_BOUNCE } from "@/lib/animations";

import type { GamePiece } from "@/lib/game";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PieceSlotProps {
  piece: GamePiece;
  isSelected: boolean;
  onSelect: () => void;
}

/** A single tappable piece in the tray. Highlights when selected. */
export default function PieceSlot({ piece, isSelected, onSelect }: PieceSlotProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (piece.isPlaced) {
    return (
      <View className="flex-1 items-center justify-center py-3 opacity-20">
        <Text className="text-text-muted text-xs">✓</Text>
      </View>
    );
  }

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.9, SPRING_PRESS);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, SPRING_BOUNCE);
      }}
      style={animatedStyle}
      className={`flex-1 items-center justify-center py-3 rounded-game-lg ${
        isSelected ? "bg-surface-bright border-2 border-primary" : "bg-surface"
      }`}
    >
      <BlockShape shape={piece.shape} color={piece.color} cellSize={22} />
    </AnimatedPressable>
  );
}
