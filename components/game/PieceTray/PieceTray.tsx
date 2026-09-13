import { View } from "react-native";

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
    <View className="px-4" style={{ overflow: "visible", zIndex: 10, marginTop: 8 }}>
      <View
        className="flex-row gap-3 rounded-game-lg p-2 items-start pt-3"
        style={{ overflow: "visible", height: 120 }}
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
