import type { ReactNode } from "react";

/** Visual style variant for the button. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "danger"
  | "ghost";

/** Size preset for the button. */
export type ButtonSize = "sm" | "md" | "lg";

/** Props for the GameButton component. */
export interface GameButtonProps {
  /** Button label text. */
  label: string;
  /** Called when the button is pressed. */
  onPress: () => void;
  /** Visual variant — determines colors and emphasis. */
  variant?: ButtonVariant;
  /** Size preset — affects padding, font size, and border radius. */
  size?: ButtonSize;
  /** Whether the button is disabled (non-interactive, dimmed). */
  isDisabled?: boolean;
  /** Whether to show a loading indicator instead of the label. */
  isLoading?: boolean;
  /** Optional icon element rendered before the label. */
  icon?: ReactNode;
  /** Additional NativeWind classes for the outer container. */
  className?: string;
}
