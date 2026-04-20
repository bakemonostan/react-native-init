import {
  type ThemeTokens,
  defaultThemeTokens,
} from "@/lib/themeTokens";

/**
 * Wizard config — aligned with `my-react-native-expo-template` as shipped.
 * See `docs/WIZARD_FLOW.md` for what toggles do today vs roadmap.
 */
export type { ThemeTokenKey, ThemeTokens, ThemeTokenSet } from "@/lib/themeTokens";

export type Navigation = "tabs" | "drawer" | "tabs+drawer" | "stack";
export type DarkMode = "system" | "light" | "dark";
/** Template reads EXPO_PUBLIC_STATE_MODE (zustand | none). */
export type StateManagement = "zustand" | "none";

/**
 * Shipped template is Axios + TanStack Query (`axios+rq`).
 * Other values are intent after clone (wizard → `# WIZARD_API` in snippet).
 */
export type ApiLayer = "axios" | "axios+rq" | "fetch" | "none";
/** Matches template `EXPO_PUBLIC_AUTH_MODE`. */
export type Auth = "mock" | "api";

/** Where primary data/auth services live after clone (wizard → `.env`; wire SDKs in the app). */
export type BackendProvider = "none" | "supabase" | "custom";

export interface ScaffoldConfig {
  // Step 1 — Basics
  appName: string;
  slug: string;
  bundleId: string;
  scheme: string;

  // Step 2 — Navigation (reference / future generator)
  navigation: Navigation;

  // Step 3 — Styling & Theme
  darkMode: DarkMode;
  primaryColor: string;
  /** Full semantic map (light + dark) → EXPO_PUBLIC_THEME_* in `.env`; template merges over base Colors. */
  themeTokens: ThemeTokens;

  // Step 4 — State
  stateManagement: StateManagement;

  // Step 5 — API / data fetching
  apiLayer: ApiLayer;

  // Step 6 — Backend + auth
  backendProvider: BackendProvider;
  /** Prefills `EXPO_PUBLIC_API_BASE_URL` when backend is custom. */
  customBackendUrl: string;
  auth: Auth;

  // Step 7 — Extras (only push toggles real env today; rest = template facts)
  useToast: boolean;
  useFeatureFlags: boolean;
  usePushNotifications: boolean;
  useI18n: boolean;
  useDebounce: boolean;
  usePermissions: boolean;
  useKeyboard: boolean;
  useDeepLinking: boolean;
  /** Not in current template — kept for forward compat, always false in UI. */
  useBiometricAuth: boolean;
}

export const STEP_ORDER = [
  "basics",
  "navigation",
  "styling",
  "state",
  "api",
  "auth",
  "extras",
  "generate",
] as const;

export type StepId = (typeof STEP_ORDER)[number];

export const STEP_LABELS: Record<StepId, string> = {
  basics: "Basics",
  navigation: "Navigation",
  styling: "Styling & Theme",
  state: "State Management",
  api: "API Layer",
  auth: "Backend & auth",
  extras: "Extras",
  generate: "Generate",
};

/** Short line shown under the active step in the sidebar (Flutter-style roadmap). */
export const STEP_HINTS: Record<StepId, string> = {
  basics: "App name, slug, scheme, bundle ID.",
  navigation: "How you plan to structure Expo Router after clone.",
  styling: "Dark mode, brand accent, and full semantic color tokens.",
  state: "Zustand as shipped, or none after fork.",
  api: "Axios, Axios + React Query, fetch, or none.",
  auth: "Backend target, API URL, then mock vs API auth.",
  extras: "Optional modules and env toggles.",
  generate: "Copy env or try a ZIP download.",
};

export const DEFAULT_CONFIG: ScaffoldConfig = {
  appName: "My App",
  slug: "my-app",
  bundleId: "com.example.myapp",
  scheme: "myapp",
  navigation: "tabs",
  darkMode: "system",
  primaryColor: "#3B82F6",
  themeTokens: defaultThemeTokens("#3B82F6"),
  stateManagement: "zustand",
  apiLayer: "axios+rq",
  backendProvider: "none",
  customBackendUrl: "",
  auth: "mock",
  useToast: true,
  useFeatureFlags: true,
  usePushNotifications: false,
  useI18n: true,
  useDebounce: true,
  usePermissions: true,
  useKeyboard: true,
  useDeepLinking: true,
  useBiometricAuth: false,
};
