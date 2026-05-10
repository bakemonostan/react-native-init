/**
 * Semantic theme token shape — aligned with RN Init `lib/themeTokens.ts`.
 * Runtime palette is built in `constants/Colors.ts` (merges `wizardSemanticTokens.generated.ts`).
 */
export const THEME_TOKEN_KEYS = [
  "background",
  "foreground",
  "card",
  "cardForeground",
  "popover",
  "popoverForeground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "accent",
  "accentForeground",
  "destructive",
  "destructiveForeground",
  "border",
  "input",
  "ring",
] as const;

export type ThemeTokenKey = (typeof THEME_TOKEN_KEYS)[number];

export type ThemeTokenSet = Record<ThemeTokenKey, string>;
