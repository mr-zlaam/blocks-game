import type { ButtonSize, ButtonVariant } from "./types";

/** ── Container class maps ──────────────────────────── */

const VARIANT_CONTAINER: Record<ButtonVariant, string> = {
  primary: "bg-primary border-primary-dark",
  secondary: "bg-secondary border-secondary-dark",
  accent: "bg-accent border-accent-dark",
  danger: "bg-danger border-danger-dark",
  ghost: "bg-transparent border-border-strong",
};

const VARIANT_CONTAINER_DISABLED: Record<ButtonVariant, string> = {
  primary: "bg-surface-elevated border-border",
  secondary: "bg-surface-elevated border-border",
  accent: "bg-surface-elevated border-border",
  danger: "bg-surface-elevated border-border",
  ghost: "bg-transparent border-border",
};

const SIZE_CONTAINER: Record<ButtonSize, string> = {
  sm: "px-4 py-2 rounded-game",
  md: "px-6 py-3 rounded-game-lg",
  lg: "px-8 py-4 rounded-game-xl",
};

/** ── Text class maps ───────────────────────────────── */

const VARIANT_TEXT: Record<ButtonVariant, string> = {
  primary: "text-text",
  secondary: "text-text",
  accent: "text-text-inverse",
  danger: "text-text",
  ghost: "text-text-muted",
};

const VARIANT_TEXT_DISABLED: Record<ButtonVariant, string> = {
  primary: "text-text-muted",
  secondary: "text-text-muted",
  accent: "text-text-muted",
  danger: "text-text-muted",
  ghost: "text-text-muted",
};

const SIZE_TEXT: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

/** Resolve container classes for a given variant, size, and disabled state. */
export function resolveContainerClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  isDisabled: boolean,
): string {
  const variantClass = isDisabled
    ? VARIANT_CONTAINER_DISABLED[variant]
    : VARIANT_CONTAINER[variant];

  return `${variantClass} ${SIZE_CONTAINER[size]} border-b-4 items-center justify-center flex-row`;
}

/** Resolve text classes for a given variant, size, and disabled state. */
export function resolveTextClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  isDisabled: boolean,
): string {
  const variantClass = isDisabled
    ? VARIANT_TEXT_DISABLED[variant]
    : VARIANT_TEXT[variant];

  return `${variantClass} ${SIZE_TEXT[size]} font-bold`;
}
