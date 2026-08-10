import { View, Text } from "react-native";

import { useGame } from "@/contexts/GameContext";
import { GameButton } from "@/components/ui/GameButton";

/**
 * Game over overlay — full-screen, covers the board.
 * Shows final score, high score, and play again button.
 * This is a custom overlay — NOT a native Modal.
 */
export default function GameOverOverlay() {
  const { state, dispatch } = useGame();

  if (state.status !== "game_over") return null;

  return (
    <View
      className="absolute inset-0 items-center justify-center"
      style={{ backgroundColor: "rgba(15, 14, 23, 0.92)" }}
    >
      <View className="bg-surface rounded-game-xl p-8 items-center mx-8">
        <Text className="text-danger text-2xl font-bold mb-2">Game Over</Text>
        <Text className="text-text-muted text-sm mb-6">No more moves!</Text>

        <Text className="text-text-muted text-xs uppercase tracking-widest">
          Final Score
        </Text>
        <Text className="text-text text-5xl font-bold mb-4">
          {state.score}
        </Text>

        {state.score >= state.highScore && state.score > 0 ? (
          <Text className="text-accent text-sm font-bold mb-4">
            🏆 New High Score!
          </Text>
        ) : (
          <Text className="text-text-muted text-sm mb-4">
            Best: {state.highScore}
          </Text>
        )}

        <Text className="text-text-muted text-xs mb-6">
          Lines: {state.totalLinesCleared} · Combos: {state.totalCombos}
        </Text>

        <GameButton
          label="Play Again"
          variant="primary"
          size="lg"
          onPress={() => dispatch({ type: "NEW_GAME" })}
        />
      </View>
    </View>
  );
}
