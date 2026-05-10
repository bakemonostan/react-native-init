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
    "Semantic theme: constants/wizardSemanticTokens.generated.ts (from Styling & theme), merged in constants/Colors.ts.",
    "Most optional modules are turned off at RUNTIME via EXPO_PUBLIC_ENABLE_* in .env (app.config.ts → extra).",
    "If you disable i18n in the wizard, i18n files and expo-localization are removed from this ZIP.",
    "",
    "After unzip:",
    "  1. Open .env and confirm values.",
    "  2. npm install",
    "  3. npx expo start",
    "",
    "You may delete any files or folders you do not need once the ZIP is extracted.",
    "Optional minimal shell: npm run strip-demo",
    "  Removes the Components gallery, components/BottomSheetScreens (demo modal shell), tab demos,",
    "  components/Examples, and app/Modal.tsx; keeps components/BottomSheetComponents (reusable wrappers).",
    "  Adds app/(app)/home.tsx, removes the Modal stack screen from app/_layout.tsx, and points auth + index redirects to /(app)/home.",
    "  Home title = APP_DISPLAY_NAME (wizard app name). Root layout still includes BottomSheetModalProvider;",
    "  add your own sheet UI under components/ or reinstall patterns from the template repo if needed.",
    "",
    "Your wizard choices (high level):",
    `  App: ${config.appName}  slug: ${config.slug}  bundle: ${config.bundleId}`,
    `  THEME_MODE (via darkMode): ${config.darkMode === "system" ? "auto" : config.darkMode}`,
    `  State: ${config.stateManagement}  HTTP client: ${config.apiLayer}  Auth: ${config.auth}`,
    `  Primary / accent (wizard + generated tokens): ${config.primaryColor}`,
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
