import { useCallback } from "react";
import { Pressable, Text, ActivityIndicator, View } from "react-native";
import * as Haptics from "expo-haptics";
import Animated from "react-native-reanimated";

import { useButtonAnimation } from "./useButtonAnimation";
import { resolveContainerClasses, resolveTextClasses } from "./styles";

import type { GameButtonProps } from "./types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * A premium, game-styled pressable button with spring animations
 * and haptic feedback. Supports multiple variants and sizes.
 *
 * @example
 * <GameButton label="Play" variant="primary" size="lg" onPress={handlePlay} />
 */
export default function GameButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  isDisabled = false,
  isLoading = false,
  icon,
  className = "",
}: GameButtonProps) {
  const disabled = isDisabled || isLoading;
  const { animatedStyle, handlePressIn, handlePressOut } =
    useButtonAnimation(disabled);

  const containerClasses = resolveContainerClasses(variant, size, disabled);
  const textClasses = resolveTextClasses(variant, size, disabled);

  const handlePress = useCallback(() => {
    if (disabled) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  }, [disabled, onPress]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}
      className={`${containerClasses} ${className}`}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={disabled ? "#94A1B2" : "#FFFFFE"}
        />
      ) : (
        <>
          {icon ? <View className="mr-2">{icon}</View> : null}
          <Text className={textClasses}>{label}</Text>
        </>
      )}
    </AnimatedPressable>
  );
}
