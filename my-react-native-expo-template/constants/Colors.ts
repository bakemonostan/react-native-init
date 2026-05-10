import type { ThemeTokenSet } from "@/config/themeFromEnv";
import {
  wizardSemanticDark,
  wizardSemanticLight,
} from "@/constants/wizardSemanticTokens.generated";

/**
 * @fileoverview Central color system: shared **palette**, **light** / **dark** semantic tokens, and **`AppColors`** typing for `ThemeProvider`.
 *
 * ## Layers
 *
 * | Layer | Use |
 * |-------|-----|
 * | **`palette`** | Raw hex/RGBA scales (neutral, primary brand, status). Shared by both themes. Prefer **semantic** tokens in UI. |
 * | **`lightColors` / `darkColors`** | Merged semantic map: static base + **wizard** tokens from {@link wizardSemanticLight} / {@link wizardSemanticDark}. |
 * | **`colors`** | Alias of **`lightColors`** — only for static assets or non-theme code. |
 *
 * ## Usage
 *
 * - **In screens & components:** use **`useTheme().colors`** (`context/ThemeContext`) so light/dark updates automatically.
 * - **Avoid** `import { colors }` for surfaces/text that should follow the active scheme; use theme hooks instead.
 * - **Wizard / ZIP:** RN Init writes `constants/wizardSemanticTokens.generated.ts` — edit that file or re-export a ZIP; do not mirror theme into `EXPO_PUBLIC_THEME_*`.
 * - **Brand ramp:** edit **`palette.primary*`** for code that still reads the shared ramp (e.g. some alerts).
 *
 * @example Theme-aware (preferred)
 * ```tsx
 * import { useTheme } from "@/hooks/useTheme";
 *
 * function Card() {
 *   const { colors } = useTheme();
 *   return (
 *     <View style={{ backgroundColor: colors.surface }}>
 *       <Text style={{ color: colors.text }}>Hello</Text>
 *     </View>
 *   );
 * }
 * ```
 */

/**
 * Shared raw scales: neutrals, primary brand ramp, status, overlays.
 */
const palette = {
  white: "#FFFFFF",
  black: "#000000",

  neutral50: "#FAFAFA",
  neutral100: "#F5F5F5",
  neutral200: "#E5E5E5",
  neutral300: "#D4D4D4",
  neutral400: "#A3A3A3",
  neutral500: "#737373",
  neutral600: "#525252",
  neutral700: "#404040",
  neutral800: "#262626",
  neutral900: "#171717",

  primary100: "#EFF6FF",
  primary200: "#BFDBFE",
  primary300: "#93C5FD",
  primary400: "#60A5FA",
  primary500: "#3B82F6",
  primary600: "#2563EB",
  primary700: "#1D4ED8",
  primary800: "#1E40AF",
  primary900: "#1E3A8A",

  success100: "#DCFCE7",
  success500: "#22C55E",
  warning100: "#FEF9C3",
  warning500: "#EAB308",
  error100: "#FEE2E2",
  error500: "#EF4444",

  transparent: "rgba(0, 0, 0, 0)",
  overlay20: "rgba(0, 0, 0, 0.2)",
  overlay50: "rgba(0, 0, 0, 0.5)",
} as const;

/** Pre-wizard structural defaults (merged with {@link wizardSemanticLight}). */
const lightColorsBase = {
  palette,
  transparent: palette.transparent,

  background: palette.white,
  backgroundSecondary: palette.neutral100,
  surface: palette.white,

  text: palette.neutral900,
  textSecondary: palette.neutral500,
  textDim: palette.neutral400,

  border: palette.neutral200,
  separator: palette.neutral200,

  primary: palette.primary600,
  primaryText: palette.white,
  tint: palette.primary600,

  error: palette.error500,
  errorBackground: palette.error100,
  success: palette.success500,
  successBackground: palette.success100,
  warning: palette.warning500,
  warningBackground: palette.warning100,

  overlay: palette.overlay20,
} as const;

/** Pre-wizard structural defaults (merged with {@link wizardSemanticDark}). */
const darkColorsBase = {
  palette,
  transparent: palette.transparent,

  background: palette.neutral900,
  backgroundSecondary: palette.neutral800,
  surface: palette.neutral800,

  text: palette.white,
  textSecondary: palette.neutral400,
  textDim: palette.neutral500,

  border: palette.neutral700,
  separator: palette.neutral700,

  primary: palette.primary400,
  primaryText: palette.neutral900,
  tint: palette.primary400,

  error: palette.error500,
  errorBackground: "#3B1515",
  success: palette.success500,
  successBackground: "#0F2A1A",
  warning: palette.warning500,
  warningBackground: "#2A2000",

  overlay: palette.overlay50,
} as const;

/**
 * Applies wizard semantic tokens on top of the static light or dark base.
 */
export function mergeSemanticTokens<
  B extends typeof lightColorsBase | typeof darkColorsBase,
>(base: B, tokens: ThemeTokenSet): B & ThemeTokenSet {
  return {
    ...base,
    background: tokens.background,
    backgroundSecondary: tokens.muted,
    surface: tokens.card,
    text: tokens.foreground,
    textSecondary: tokens.mutedForeground,
    textDim: tokens.mutedForeground,
    border: tokens.border,
    separator: tokens.border,
    primary: tokens.primary,
    primaryText: tokens.primaryForeground,
    tint: tokens.ring,
    error: tokens.destructive,
    errorBackground: tokens.muted,
    foreground: tokens.foreground,
    card: tokens.card,
    cardForeground: tokens.cardForeground,
    popover: tokens.popover,
    popoverForeground: tokens.popoverForeground,
    secondary: tokens.secondary,
    secondaryForeground: tokens.secondaryForeground,
    muted: tokens.muted,
    mutedForeground: tokens.mutedForeground,
    accent: tokens.accent,
    accentForeground: tokens.accentForeground,
    destructive: tokens.destructive,
    destructiveForeground: tokens.destructiveForeground,
    input: tokens.input,
    ring: tokens.ring,
  } as unknown as B & ThemeTokenSet;
}

export const lightColors = mergeSemanticTokens(
  lightColorsBase,
  wizardSemanticLight,
);

export const darkColors = mergeSemanticTokens(
  darkColorsBase,
  wizardSemanticDark,
);

export type AppColors = (typeof lightColors | typeof darkColors) &
  Partial<ThemeTokenSet>;

/** Fixed **light** semantic map — alias of {@link lightColors}. */
export const colors = lightColors;

export type SemanticTone =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "destructive";

/** Background + on-color text for a semantic tone. */
export function toneFgBg(
  colors: AppColors,
  tone: SemanticTone,
): { background: string; foreground: string } {
  const secondaryBg = colors.secondary ?? colors.backgroundSecondary;
  const secondaryFg = colors.secondaryForeground ?? colors.text;
  const mutedBg = colors.muted ?? colors.backgroundSecondary;
  const mutedFg = colors.mutedForeground ?? colors.textSecondary;
  const accentBg = colors.accent ?? colors.palette.primary100;
  const accentFg = colors.accentForeground ?? colors.palette.primary900;
  const destructiveBg = colors.destructive ?? colors.error;
  const destructiveFg = colors.destructiveForeground ?? colors.palette.white;

  switch (tone) {
    case "primary":
      return {
        background: colors.primary,
        foreground: colors.primaryText,
      };
    case "secondary":
      return {
        background: secondaryBg,
        foreground: secondaryFg,
      };
    case "muted":
      return {
        background: mutedBg,
        foreground: mutedFg,
      };
    case "accent":
      return {
        background: accentBg,
        foreground: accentFg,
      };
    case "destructive":
      return {
        background: destructiveBg,
        foreground: destructiveFg,
      };
  }
}
