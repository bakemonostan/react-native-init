/**
 * Suggested Expo identifiers from a human-readable app name (Basics step autofill).
 * Keeps slug / scheme / bundle in sync until the user edits a field away from the suggestion.
 */

const PLACEHOLDER_BUNDLE_IDS = new Set(["com.example.myapp"]);

function tokensFromName(name: string): string[] {
  return name
    .toLowerCase()
    .trim()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** e.g. "My App" → "my-app", "zipper" → "zipper-app" */
export function deriveSlugFromAppName(name: string): string {
  const tokens = tokensFromName(name);
  if (tokens.length === 0) return "my-app";
  if (tokens.length === 1) {
    const base = tokens[0]!.slice(0, 32);
    const withSuffix = `${base}-app`;
    return withSuffix.slice(0, 40);
  }
  return tokens.join("-").slice(0, 40);
}

/** Deep link scheme: lowercase alnum, must start with a letter. */
export function deriveSchemeFromAppName(name: string): string {
  let s = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!s) s = "myapp";
  if (!/^[a-z]/.test(s)) s = `x${s}`;
  return s.slice(0, 40);
}

/** Reverse-DNS style bundle segment from the display name. */
export function deriveBundleIdFromAppName(name: string): string {
  const core = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24) || "myapp";
  return `com.${core}.myapp`;
}

export function deriveBasicsFromAppName(name: string): {
  slug: string;
  scheme: string;
  bundleId: string;
} {
  return {
    slug: deriveSlugFromAppName(name),
    scheme: deriveSchemeFromAppName(name),
    bundleId: deriveBundleIdFromAppName(name),
  };
}

export function isPlaceholderBundleId(bundleId: string): boolean {
  return PLACEHOLDER_BUNDLE_IDS.has(bundleId.trim());
}
