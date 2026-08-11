import { View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { GameProvider } from "@/contexts/GameContext";
import { Board } from "@/components/game/Board";
import { PieceTray } from "@/components/game/PieceTray";
import { ScoreBar } from "@/components/game/ScoreBar";
import { GameOverOverlay } from "@/components/game/GameOverOverlay";
import { SettingsModal } from "@/components/game/SettingsModal";

export default function Game() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <GameProvider>
      <View className="flex-1 bg-background">
        <SafeAreaView className="flex-1">
          {/* Top Bar / Settings */}
          <View className="flex-row justify-between items-center px-4 pt-4">
            <Pressable 
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSettingsOpen(true);
              }}
              className="p-2"
            >
              <Ionicons name="pause" size={32} color="#94A1B2" />
            </Pressable>
          </View>

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
        
        {/* In-Game Settings Menu */}
        <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </View>
    </GameProvider>
  );
}
