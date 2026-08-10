import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GameProvider } from "@/contexts/GameContext";
import { Board } from "@/components/game/Board";
import { PieceTray } from "@/components/game/PieceTray";
import { ScoreBar } from "@/components/game/ScoreBar";
import { GameOverOverlay } from "@/components/game/GameOverOverlay";

export default function Index() {
  return (
    <GameProvider>
      <View className="flex-1 bg-background">
        <SafeAreaView className="flex-1">
          {/* Score HUD */}
          <ScoreBar />

          {/* Game Board */}
          <View className="flex-1 justify-center">
            <Board />
          </View>

          {/* Piece Tray */}
          <PieceTray />

          {/* Spacer for bottom safe area */}
          <View className="h-4" />
        </SafeAreaView>

        {/* Game Over Overlay (renders on top when game_over) */}
        <GameOverOverlay />
      </View>
    </GameProvider>
  );
}
