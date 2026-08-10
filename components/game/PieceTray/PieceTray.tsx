import { View, Text } from "react-native";

import { useGame } from "@/contexts/GameContext";
import PieceSlot from "./PieceSlot";

/**
 * Displays the 3 available pieces for the current round.
 * Player taps a piece to select it, then taps the board to place.
 */
export default function PieceTray() {
  const { state, dispatch } = useGame();

  return (
    <View className="px-4 mt-4">
      <Text className="text-text-muted text-xs uppercase tracking-widest mb-2 text-center">
        {state.selectedPieceIndex !== null
          ? "Tap the board to place"
          : "Select a piece"}
      </Text>
      <View className="flex-row gap-3">
        {state.pieces.map((piece, index) => (
          <PieceSlot
            key={`${piece.shape.id}-${index}`}
            piece={piece}
            isSelected={state.selectedPieceIndex === index}
            onSelect={() => dispatch({ type: "SELECT_PIECE", index })}
          />
        ))}
      </View>
    </View>
  );
}
