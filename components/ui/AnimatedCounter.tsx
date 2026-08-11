import { useEffect, useState } from "react";
import { Text, type TextProps } from "react-native";
import {
  useSharedValue,
  useAnimatedReaction,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

interface AnimatedCounterProps extends Omit<TextProps, "children"> {
  value: number;
  /** Animation duration in ms. Default 600. */
  duration?: number;
}

/**
 * Lottery-style animated number counter.
 * Rolls up from the previous value to the new value.
 */
export default function AnimatedCounter({
  value,
  duration = 600,
  ...textProps
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(value);
  const animated = useSharedValue(value);

  useEffect(() => {
    animated.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.quad),
    });
  }, [value, duration, animated]);

  useAnimatedReaction(
    () => Math.round(animated.value),
    (current, prev) => {
      if (current !== prev) {
        runOnJS(setDisplay)(current);
      }
    },
  );

  return <Text {...textProps}>{display}</Text>;
}
