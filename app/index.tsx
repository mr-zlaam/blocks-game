import { View, Text } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { BouncyButton } from "@/components/ui/BouncyButton";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <View className="items-center mb-16">
        <Text className="text-white text-6xl font-black mb-2 tracking-tighter">BLOCKS</Text>
        <Text className="text-primary-light text-2xl font-bold tracking-widest">PUZZLE</Text>
      </View>

      <View className="gap-6 w-64">
        <Link href="/game" asChild>
          <BouncyButton
            haptic="Medium"
            className="h-16 bg-primary flex-row justify-center items-center rounded-game-xl"
            style={{
              borderBottomWidth: 4,
              borderBottomColor: "#4A3DB8",
            }}
          >
            <Ionicons name="play" size={32} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-2xl font-black tracking-wide">PLAY</Text>
          </BouncyButton>
        </Link>

      </View>
    </View>
  );
}
