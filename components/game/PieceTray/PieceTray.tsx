import { View, Text } from "react-native";

import { useGame } from "@/contexts/GameContext";
import DraggablePiece from "./DraggablePiece";

/**
 * Displays the 3 available pieces for the current round.
 * Each piece is draggable onto the board.
 * overflow: visible ensures dragged pieces render above the board.
 */
export default function PieceTray() {
  const { state } = useGame();

  return (
    <View className="px-4 mt-4" style={{ overflow: "visible", zIndex: 10 }}>
      <Text className="text-text-muted text-xs uppercase tracking-widest mb-2 text-center">
        Drag a piece to the board
      </Text>
      <View
        className="flex-row gap-3 bg-surface rounded-game-lg p-2"
        style={{ overflow: "visible" }}
      >
        {state.pieces.map((piece, index) => (
          <DraggablePiece
            key={`${piece.shape.id}-${index}`}
            piece={piece}
            index={index}
          />
        ))}
      </View>
    </View>
  );
}
