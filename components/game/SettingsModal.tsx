import { useState, useEffect } from "react";
import { View, Text, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getIsSoundEnabled, toggleSoundEnabled } from "@/lib/audio";
import { useGame } from "@/contexts/GameContext";
import { BouncyButton } from "@/components/ui/BouncyButton";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { dispatch } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(getIsSoundEnabled());

  useEffect(() => {
    if (visible) {
      setSoundEnabled(getIsSoundEnabled());
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-center items-center px-8">
        <View className="bg-surface-elevated w-full rounded-game-xl p-8 items-center border-t-2 border-l-2 border-surface-bright shadow-2xl">
          <Text className="text-white text-3xl font-black mb-8 tracking-wider">GAME MENU</Text>
          
          <BouncyButton
            haptic="Medium"
            onPress={onClose}
            className="w-full h-16 bg-primary flex-row justify-center items-center rounded-game-xl mb-4"
            style={{ borderBottomWidth: 4, borderBottomColor: "#4A3DB8" }}
          >
            <Ionicons name="play" size={28} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-xl font-bold">Resume</Text>
          </BouncyButton>

          <BouncyButton
            haptic="Heavy"
            onPress={() => {
              dispatch({ type: "NEW_GAME" });
              onClose();
            }}
            className="w-full h-16 bg-danger flex-row justify-center items-center rounded-game-xl mb-4"
            style={{ borderBottomWidth: 4, borderBottomColor: "#D63031" }}
          >
            <Ionicons name="refresh" size={28} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-xl font-bold">Restart Game</Text>
          </BouncyButton>

          <BouncyButton
            haptic="Light"
            onPress={async () => {
              const newVal = await toggleSoundEnabled();
              setSoundEnabled(newVal);
            }}
            className="w-full h-16 bg-surface-bright flex-row justify-center items-center rounded-game-xl"
            style={{ borderBottomWidth: 4, borderBottomColor: "#2A2940" }}
          >
            <Ionicons 
              name={soundEnabled ? "volume-high" : "volume-mute"} 
              size={28} 
              color={soundEnabled ? "#00B894" : "#FF6B6B"} 
              style={{ marginRight: 8 }} 
            />
            <Text className="text-white text-xl font-bold">
              Sound: {soundEnabled ? "ON" : "OFF"}
            </Text>
          </BouncyButton>
        </View>
      </View>
    </Modal>
  );
}
