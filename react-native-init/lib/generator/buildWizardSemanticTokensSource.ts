import type { ScaffoldConfig } from "@/features/wizard/types";
import { THEME_TOKEN_KEYS, type ThemeTokenSet } from "@/lib/themeTokens";

function serializeTokenSet(tokens: ThemeTokenSet): string {
  return THEME_TOKEN_KEYS.map((k) => `  ${k}: ${JSON.stringify(tokens[k])},`).join(
    "\n",
  );
}

/**
 * TypeScript module written into the Expo template zip as
 * `constants/wizardSemanticTokens.generated.ts`.
 */
export function buildWizardSemanticTokensSource(config: ScaffoldConfig): string {
  return `/**
 * Semantic theme from RN Init — source of truth for app colors (merged in \`constants/Colors.ts\`).
 * Regenerate by exporting a new ZIP from the wizard. Do not duplicate into EXPO_PUBLIC_THEME_*.
 */
import type { ThemeTokenSet } from "@/config/themeFromEnv";

export const wizardSemanticLight: ThemeTokenSet = {
${serializeTokenSet(config.themeTokens.light)}
};

export const wizardSemanticDark: ThemeTokenSet = {
${serializeTokenSet(config.themeTokens.dark)}
};
`;
}
