import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { playSound } from "@/lib/audio";
import { useGame } from "@/contexts/GameContext";
import { BouncyButton } from "@/components/ui/BouncyButton";

/**
 * Game over overlay — full-screen, covers the board.
 * Animates a text over the board for 2 seconds, then shows final screen.
 */
export default function GameOverOverlay() {
  const { state, dispatch } = useGame();
  const [phase, setPhase] = useState<"hidden" | "animating" | "result">("hidden");

  useEffect(() => {
    if (state.status === "game_over") {
      setPhase("animating");
      void playSound("lose");
      
      const timer = setTimeout(() => {
        setPhase("result");
        void playSound("gameover");
      }, 2800);
      return () => clearTimeout(timer);
    } else {
      setPhase("hidden");
      return undefined;
    }
  }, [state.status]);

  if (phase === "hidden") return null;

  if (phase === "animating") {
    return (
      <View className="absolute inset-0 items-center justify-center pointer-events-none z-50">
        <Text 
          className="text-white text-5xl font-black text-center leading-tight" 
          style={{
            textShadowColor: 'rgba(0, 0, 0, 0.8)', 
            textShadowRadius: 15, 
            textShadowOffset: { width: 0, height: 6 }
          }}
        >
          No Space{"\n"}Left!
        </Text>
      </View>
    );
  }

  return (
    <View
      className="absolute inset-0 items-center justify-center"
      style={{ backgroundColor: "rgba(15, 14, 23, 0.98)" }}
    >
      <View className="items-center px-8 w-full max-w-sm">
        <Text className="text-accent text-5xl font-black mb-1 tracking-wide text-center">You Lost</Text>
        <Text className="text-accent text-4xl font-black mb-12 tracking-wide text-center">Try Again!</Text>

        <Text className="text-text-muted text-sm uppercase tracking-widest font-bold mb-2">
          Score
        </Text>
        <Text className="text-white text-7xl font-black mb-10 tracking-tight">
          {state.score}
        </Text>

        <Text className="text-text-muted text-sm uppercase tracking-widest font-bold mb-2">
          Best Score
        </Text>
        <Text className="text-accent text-4xl font-black mb-14 tracking-tight">
          {state.highScore}
        </Text>

        <BouncyButton
          haptic="Medium"
          onPress={() => {
            dispatch({ type: "NEW_GAME" });
          }}
          className="w-48 h-16 bg-primary flex-row justify-center items-center rounded-game-xl"
          style={{
            borderBottomWidth: 4,
            borderBottomColor: "#4A3DB8", // primary-dark
          }}
        >
          <Ionicons name="play" size={36} color="white" style={{ marginLeft: 6 }} />
        </BouncyButton>
      </View>
    </View>
  );
}
