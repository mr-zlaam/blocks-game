import { View, Text } from "react-native";

import { useGame } from "@/contexts/GameContext";
import { getComboMultiplier } from "@/lib/game";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

/** Score display with lottery-style counter and combo indicator. */
export default function ScoreBar() {
  const { state } = useGame();
  const multiplier = getComboMultiplier(state.combo);
  const showCombo = state.combo > 0;

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Score */}
      <View className="items-center">
        <Text className="text-text-muted text-xs uppercase tracking-widest">
          Score
        </Text>
        <AnimatedCounter
          value={state.score}
          duration={800}
          className="text-text text-3xl font-bold"
        />
      </View>

      {/* Combo */}
      {showCombo ? (
        <View className="items-center bg-primary/20 px-4 py-2 rounded-game">
          <Text className="text-primary-light text-xs font-bold uppercase">
            Combo
          </Text>
          <Text className="text-primary-light text-xl font-bold">
            ×{multiplier.toFixed(1)}
          </Text>
        </View>
      ) : (
        <View />
      )}

      {/* High Score */}
      <View className="items-center">
        <Text className="text-text-muted text-xs uppercase tracking-widest">
          Best
        </Text>
        <AnimatedCounter
          value={state.highScore}
          duration={800}
          className="text-text-muted text-xl font-bold"
        />
      </View>
    </View>
  );
}
