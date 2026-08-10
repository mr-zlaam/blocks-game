import { ScrollView, Text, View } from "react-native";

import { GameButton } from "@/components/ui/GameButton";

function SectionTitle({ title }: { title: string }) {
  return <Text className="text-text-muted text-sm mb-3 uppercase tracking-widest">{title}</Text>;
}

const noop = () => {};

export default function Index() {

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-12">
        {/* ── Header ───────────────────────── */}
        <Text className="text-text text-3xl font-bold mb-2">
          🧱 Blocks
        </Text>
        <Text className="text-text-muted text-base mb-10">
          Component Showcase
        </Text>

        {/* ── Variants ─────────────────────── */}
        <SectionTitle title="Variants" />
        <View className="gap-3 mb-10">
          <GameButton
            label="Play Now"
            variant="primary"
            size="lg"
            onPress={noop}
          />
          <GameButton
            label="Continue"
            variant="secondary"
            onPress={noop}
          />
          <GameButton
            label="Daily Reward"
            variant="accent"
            onPress={noop}
          />
          <GameButton
            label="Delete Save"
            variant="danger"
            onPress={noop}
          />
          <GameButton
            label="Settings"
            variant="ghost"
            onPress={noop}
          />
        </View>

        {/* ── Sizes ────────────────────────── */}
        <SectionTitle title="Sizes" />
        <View className="gap-3 mb-10">
          <GameButton
            label="Small"
            variant="primary"
            size="sm"
            onPress={noop}
          />
          <GameButton
            label="Medium (default)"
            variant="primary"
            size="md"
            onPress={noop}
          />
          <GameButton
            label="Large"
            variant="primary"
            size="lg"
            onPress={noop}
          />
        </View>

        {/* ── States ───────────────────────── */}
        <SectionTitle title="States" />
        <View className="gap-3 mb-10">
          <GameButton
            label="Disabled"
            variant="primary"
            isDisabled
            onPress={noop}
          />
          <GameButton
            label="Loading..."
            variant="secondary"
            isLoading
            onPress={noop}
          />
        </View>
      </View>
    </ScrollView>
  );
}
