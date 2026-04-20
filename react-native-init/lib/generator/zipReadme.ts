import type { ScaffoldConfig } from "@/features/wizard/types";

/**
 * Dropped into generated zips so people know the wizard does not strip source files.
 */
export function buildZipReadme(config: ScaffoldConfig): string {
  const lines = [
    "RN Init — generated project",
    "===========================",
    "",
    "This ZIP is the full Expo template plus a root .env file from your wizard answers.",
    "Semantic theme: EXPO_PUBLIC_THEME_LIGHT_* / EXPO_PUBLIC_THEME_DARK_* (full token set when you use Styling & theme).",
    "Optional modules (toast, i18n, debounce, etc.) are NOT removed from the repo when you turn them off.",
    "They are turned off at RUNTIME via EXPO_PUBLIC_ENABLE_* flags inside .env (read by app.config.ts → extra).",
    "",
    "After unzip:",
    "  1. Open .env and confirm values.",
    "  2. npm install",
    "  3. npx expo start",
    "",
    "Your wizard choices (high level):",
    `  App: ${config.appName}  slug: ${config.slug}  bundle: ${config.bundleId}`,
    `  THEME_MODE (via darkMode): ${config.darkMode === "system" ? "auto" : config.darkMode}`,
    `  State: ${config.stateManagement}  HTTP client: ${config.apiLayer}  Auth: ${config.auth}`,
    `  Brand (EXPO_PUBLIC_BRAND_PRIMARY → primary/tint): ${config.primaryColor}`,
    "",
    "Module env toggles (1 = on, 0 = off):",
    `  EXPO_PUBLIC_ENABLE_TOAST=${config.useToast ? "1" : "0"}`,
    `  EXPO_PUBLIC_ENABLE_I18N=${config.useI18n ? "1" : "0"}`,
    `  EXPO_PUBLIC_ENABLE_FEATURE_FLAGS=${config.useFeatureFlags ? "1" : "0"}`,
    `  EXPO_PUBLIC_ENABLE_DEBOUNCE=${config.useDebounce ? "1" : "0"}`,
    `  EXPO_PUBLIC_ENABLE_MEDIA_PERMISSIONS=${config.usePermissions ? "1" : "0"}`,
    `  EXPO_PUBLIC_ENABLE_KEYBOARD=${config.useKeyboard ? "1" : "0"}`,
    `  EXPO_PUBLIC_ENABLE_DEEP_LINKING=${config.useDeepLinking ? "1" : "0"}`,
    `  EXPO_PUBLIC_PUSH_SETUP=${config.usePushNotifications ? "1" : "0"}`,
    "",
  ];
  return lines.join("\n");
}
