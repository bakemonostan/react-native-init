import { THEME_TOKEN_KEYS } from "@/lib/themeTokens";
import { z } from "zod";

const colorToken = z.string().min(1).max(120);

const themeTokenSetSchema = z.object(
  Object.fromEntries(THEME_TOKEN_KEYS.map((k) => [k, colorToken])) as Record<
    (typeof THEME_TOKEN_KEYS)[number],
    typeof colorToken
  >,
);

const themeTokensSchema = z.object({
  light: themeTokenSetSchema,
  dark: themeTokenSetSchema,
});

/** POST /api/generate body — mirrors `features/wizard/types` `ScaffoldConfig`. */
export const scaffoldConfigSchema = z.object({
  appName: z.string().min(1).max(80),
  slug: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z0-9-]+$/),
  bundleId: z.string().min(3).max(120),
  scheme: z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-z][a-z0-9-]*$/),
  navigation: z.enum(["tabs", "drawer", "tabs+drawer", "stack"]),
  darkMode: z.enum(["system", "light", "dark"]),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?([0-9A-Fa-f]{2})?$/),
  themeTokens: themeTokensSchema,
  stateManagement: z.enum(["zustand", "none"]),
  apiLayer: z.enum(["axios", "axios+rq", "fetch", "none"]),
  backendProvider: z.enum(["none", "supabase", "custom"]),
  customBackendUrl: z.string(),
  auth: z.enum(["mock", "api"]),
  useToast: z.boolean(),
  useFeatureFlags: z.boolean(),
  usePushNotifications: z.boolean(),
  useI18n: z.boolean(),
  useDebounce: z.boolean(),
  usePermissions: z.boolean(),
  useKeyboard: z.boolean(),
  useDeepLinking: z.boolean(),
  useBiometricAuth: z.boolean(),
});

export type ParsedScaffoldConfig = z.infer<typeof scaffoldConfigSchema>;
