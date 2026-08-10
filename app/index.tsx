import { ScrollView, Text, View } from "react-native";

import { GameButton } from "@/components/ui/GameButton";
import { BlockShape } from "@/components/game/BlockShape";
import { SHAPES_BY_TIER, BLOCK_COLORS } from "@/lib/game";

import type { DifficultyTier, BlockColor } from "@/lib/game";

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="text-text-muted text-sm mb-3 uppercase tracking-widest">
      {title}
    </Text>
  );
}

const noop = () => {};

/** Assigns a color to a shape index for visual variety. */
function colorForIndex(index: number): BlockColor {
  return BLOCK_COLORS[index % BLOCK_COLORS.length] ?? "blue";
}

const TIER_LABELS: Record<DifficultyTier, string> = {
  1: "Tier 1 — Easy",
  2: "Tier 2 — Medium",
  3: "Tier 3 — Hard",
  4: "Tier 4 — Very Hard",
  5: "Tier 5 — Nightmare",
};

const TIERS: readonly DifficultyTier[] = [1, 2, 3, 4, 5];

export default function Index() {
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-12">
        {/* ── Header ───────────────────────── */}
        <Text className="text-text text-3xl font-bold mb-2">🧱 Blocks</Text>
        <Text className="text-text-muted text-base mb-10">
          Component Showcase
        </Text>

        {/* ── Buttons ──────────────────────── */}
        <SectionTitle title="Buttons" />
        <View className="gap-3 mb-10">
          <GameButton
            label="Play Now"
            variant="primary"
            size="lg"
            onPress={noop}
          />
          <View className="flex-row gap-3">
            <View className="flex-1">
              <GameButton label="Continue" variant="secondary" onPress={noop} />
            </View>
            <View className="flex-1">
              <GameButton label="Settings" variant="ghost" onPress={noop} />
            </View>
          </View>
        </View>

        {/* ── Block Shapes by Tier ──────────── */}
        {TIERS.map((tier) => {
          const shapes = SHAPES_BY_TIER[tier];
          return (
            <View key={tier} className="mb-10">
              <SectionTitle title={TIER_LABELS[tier]} />
              <View className="bg-surface rounded-game-lg p-4">
                <View className="flex-row flex-wrap gap-5">
                  {shapes.map((shape, i) => (
                    <View key={shape.id} className="items-center">
                      <BlockShape
                        shape={shape}
                        color={colorForIndex(i + tier * 3)}
                      />
                      <Text className="text-text-muted text-xs mt-2">
                        {shape.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
