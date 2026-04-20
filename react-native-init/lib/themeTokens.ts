/**
 * Semantic theme tokens (hex / rgba) — wizard + `.env` + Expo template.
 * Keep keys in sync with `my-react-native-expo-template/config/themeFromEnv.ts`.
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

export type ThemeTokens = {
  light: ThemeTokenSet;
  dark: ThemeTokenSet;
};

/** UI grouping — every {@link ThemeTokenKey} appears once. */
export const THEME_TOKEN_GROUPS: { id: string; label: string; keys: ThemeTokenKey[] }[] =
  [
    { id: "base", label: "Base", keys: ["background", "foreground"] },
    {
      id: "surfaces",
      label: "Card & popover",
      keys: ["card", "cardForeground", "popover", "popoverForeground"],
    },
    { id: "primary", label: "Primary", keys: ["primary", "primaryForeground"] },
    {
      id: "secondary",
      label: "Secondary",
      keys: ["secondary", "secondaryForeground"],
    },
    { id: "muted", label: "Muted", keys: ["muted", "mutedForeground"] },
    { id: "accent", label: "Accent", keys: ["accent", "accentForeground"] },
    {
      id: "destructive",
      label: "Destructive",
      keys: ["destructive", "destructiveForeground"],
    },
    { id: "border", label: "Border & input", keys: ["border", "input", "ring"] },
  ];

/** `cardForeground` → `CARD_FOREGROUND` for EXPO_PUBLIC_THEME_LIGHT_* */
export function themeKeyToEnvSuffix(key: ThemeTokenKey): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toUpperCase();
}

export function buildThemeEnvPrefix(mode: "light" | "dark"): string {
  return mode === "light"
    ? "EXPO_PUBLIC_THEME_LIGHT_"
    : "EXPO_PUBLIC_THEME_DARK_";
}

export function defaultLightTokens(primary: string): ThemeTokenSet {
  const p = primary.trim() || "#3B82F6";
  return {
    background: "#FFFFFF",
    foreground: "#0A0A0A",
    card: "#FFFFFF",
    cardForeground: "#0A0A0A",
    popover: "#FFFFFF",
    popoverForeground: "#0A0A0A",
    primary: p,
    primaryForeground: "#FAFAFA",
    secondary: "#F4F4F5",
    secondaryForeground: "#18181B",
    muted: "#F4F4F5",
    mutedForeground: "#71717A",
    accent: "#F4F4F5",
    accentForeground: "#18181B",
    destructive: "#EF4444",
    destructiveForeground: "#FAFAFA",
    border: "#E4E4E7",
    input: "#E4E4E7",
    ring: p,
  };
}

export function defaultDarkTokens(primary: string): ThemeTokenSet {
  const p = primary.trim() || "#3B82F6";
  return {
    background: "#0A0A0A",
    foreground: "#FAFAFA",
    card: "#171717",
    cardForeground: "#FAFAFA",
    popover: "#171717",
    popoverForeground: "#FAFAFA",
    primary: p,
    primaryForeground: "#FAFAFA",
    secondary: "#27272A",
    secondaryForeground: "#FAFAFA",
    muted: "#27272A",
    mutedForeground: "#A1A1AA",
    accent: "#27272A",
    accentForeground: "#FAFAFA",
    destructive: "#DC2626",
    destructiveForeground: "#FAFAFA",
    border: "#27272A",
    input: "#27272A",
    ring: p,
  };
}

export function defaultThemeTokens(primary: string): ThemeTokens {
  return {
    light: defaultLightTokens(primary),
    dark: defaultDarkTokens(primary),
  };
}

function randomHex(): string {
  const n = Math.floor(Math.random() * 0xffffff);
  return `#${n.toString(16).padStart(6, "0").toUpperCase()}`;
}

/** Random hex for every token (light + dark). `primaryColor` is aligned to `light.primary`. */
export function randomThemeTokens(): ThemeTokens {
  const light = {} as ThemeTokenSet;
  const dark = {} as ThemeTokenSet;
  for (const key of THEME_TOKEN_KEYS) {
    light[key] = randomHex();
    dark[key] = randomHex();
  }
  return { light, dark };
}
