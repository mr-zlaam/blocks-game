import type { WithSpringConfig } from "react-native-reanimated";

/** Snappy press feedback — used for buttons and tappable elements. */
export const SPRING_PRESS: WithSpringConfig = {
  damping: 15,
  stiffness: 300,
};

/** Bouncy release — used after press release for playful feel. */
export const SPRING_BOUNCE: WithSpringConfig = {
  damping: 10,
  stiffness: 350,
};

/** Gentle ease — used for layout transitions and modals. */
export const SPRING_GENTLE: WithSpringConfig = {
  damping: 20,
  stiffness: 100,
};

/** Quick snap — used for grid snapping and placement. */
export const SPRING_SNAP: WithSpringConfig = {
  damping: 12,
  stiffness: 250,
};
