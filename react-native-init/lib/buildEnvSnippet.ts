import type { ScaffoldConfig } from "@/features/wizard/types";

/**
 * Maps wizard answers → `.env` lines for `my-react-native-expo-template`
 * (must stay in sync with `app.config.ts` + `.env.example` in that repo).
 */
export function buildEnvFromWizardConfig(config: ScaffoldConfig): string {
  const themeMode =
    config.darkMode === "system" ? "auto" : config.darkMode;

  const customUrl = config.customBackendUrl.trim();
  const apiBaseUrl =
    config.backendProvider === "custom" && customUrl !== ""
      ? escapeEnv(customUrl)
      : "";

  const lines = [
    "# --- RN Init wizard (paste into Expo template root as `.env`) ---",
    "",
    "APP_ENV=development",
    `APP_DISPLAY_NAME=${escapeEnv(config.appName)}`,
    `EXPO_PUBLIC_SLUG=${escapeEnv(config.slug)}`,
    `EXPO_PUBLIC_SCHEME=${escapeEnv(config.scheme)}`,
    `IOS_BUNDLE_ID=${escapeEnv(config.bundleId)}`,
    `ANDROID_PACKAGE=${escapeEnv(config.bundleId)}`,
    "",
    `THEME_MODE=${themeMode}`,
    "# Semantic theme: constants/wizardSemanticTokens.generated.ts (ZIP overwrites from wizard).",
    "",
    "# State + HTTP client (read in Expo app: config/featureFlags.ts → runtimeModes)",
    `EXPO_PUBLIC_STATE_MODE=${config.stateManagement}`,
    `EXPO_PUBLIC_HTTP_CLIENT=${config.apiLayer}`,
    "",
    "# Backend: none | supabase | custom (read in app when you add SDKs / clients)",
    `EXPO_PUBLIC_BACKEND_PROVIDER=${config.backendProvider}`,
    "",
    "# API (custom backend → prefilled from wizard; supabase/none usually leave empty until wired)",
    `EXPO_PUBLIC_API_BASE_URL=${apiBaseUrl}`,
    "EXPO_PUBLIC_API_BASE_URL_STAGING=",
    "",
    `# Auth: mock = local dev; api = services/authBackend.ts → your REST`,
    `EXPO_PUBLIC_AUTH_MODE=${config.auth === "api" ? "api" : "mock"}`,
    "",
    "# Push: 1 = opt-in registration hook in template root layout",
    `EXPO_PUBLIC_PUSH_SETUP=${config.usePushNotifications ? "1" : "0"}`,
    "",
    "# Optional template modules (Expo: app.config extra → config/featureFlags.ts)",
    `EXPO_PUBLIC_ENABLE_TOAST=${config.useToast ? "1" : "0"}`,
    ...(config.useI18n ? [`EXPO_PUBLIC_ENABLE_I18N=1`] : []),
    "# When 0, EXPO_PUBLIC_STATE_MODE + EXPO_PUBLIC_HTTP_CLIENT are ignored (zustand + axios+rq).",
    `EXPO_PUBLIC_ENABLE_FEATURE_FLAGS=${config.useFeatureFlags ? "1" : "0"}`,
    `EXPO_PUBLIC_ENABLE_DEBOUNCE=${config.useDebounce ? "1" : "0"}`,
    `EXPO_PUBLIC_ENABLE_MEDIA_PERMISSIONS=${config.usePermissions ? "1" : "0"}`,
    `EXPO_PUBLIC_ENABLE_KEYBOARD=${config.useKeyboard ? "1" : "0"}`,
    `EXPO_PUBLIC_ENABLE_DEEP_LINKING=${config.useDeepLinking ? "1" : "0"}`,
    "",
    "# Optional Universal Links (comma-separated hosts, no scheme)",
    "# EXPO_PUBLIC_IOS_ASSOCIATED_DOMAINS=",
    "",
    "",
    "# Navigation choice (reference for future generator — template uses Expo Router tabs shell)",
    `# WIZARD_NAV=${config.navigation}`,
  ];

  if (config.backendProvider === "supabase") {
    lines.push(
      "",
      "# Supabase — install @supabase/supabase-js and create client from these",
      "EXPO_PUBLIC_SUPABASE_URL=",
      "EXPO_PUBLIC_SUPABASE_ANON_KEY=",
    );
  }

  return lines.join("\n");
}

/** First lines of `.env` (Basics + navigation comment) for live preview on steps 1–2. */
export function previewBasicsAndNavigationEnv(config: ScaffoldConfig): string {
  const themeMode =
    config.darkMode === "system" ? "auto" : config.darkMode;
  return [
    "# Preview — full snippet on Generate step",
    `APP_DISPLAY_NAME=${escapeEnv(config.appName)}`,
    `EXPO_PUBLIC_SLUG=${escapeEnv(config.slug)}`,
    `EXPO_PUBLIC_SCHEME=${escapeEnv(config.scheme)}`,
    `IOS_BUNDLE_ID=${escapeEnv(config.bundleId)}`,
    `ANDROID_PACKAGE=${escapeEnv(config.bundleId)}`,
    `THEME_MODE=${themeMode}`,
    `# WIZARD_NAV=${config.navigation}  # product direction after clone`,
  ].join("\n");
}

function escapeEnv(value: string): string {
  const v = value.trim();
  if (/[\s#"']/.test(v)) {
    return `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return v;
}
