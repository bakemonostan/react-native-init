/** Public site copy — GitHub profile for attribution links */
export const SITE_GITHUB_URL = "https://github.com/bakemonostan";
export const SITE_PROFILE_NAME = "BakemonoStan";

export const SITE_X_URL = "https://x.com/BakemonoStan";
/** Without @ — used for Twitter / X metadata.creator */
export const SITE_TWITTER_HANDLE = "BakemonoStan";
export const SITE_LINKEDIN_URL = "https://www.linkedin.com/in/omokhomionehis/";
export const SITE_CONTACT_EMAIL = "ehizomokhomion@gmail.com";

export const SITE_NAME = "RN Init";

export const SITE_DESCRIPTION =
  "Configure an Expo + React Native stack with a guided wizard: paste-ready .env keys, optional template ZIP, SVGR typed icons, Expo Router, TanStack Query + Axios, auth modes — align choices before you ship.";

export const SITE_KEYWORDS = [
  "React Native",
  "Expo",
  "Expo Router",
  "Expo template",
  "scaffold",
  "wizard",
  "environment variables",
  "Zustand",
  "TanStack Query",
  "Axios",
  "TypeScript",
  "mobile app template",
  "SVG icons",
  "SVGR",
  "SecureStore",
  "THEME_MODE",
] as const;

/** Resolve public site URL for Open Graph / canonical (Vercel or env override). */
export function getSiteOrigin(): URL | undefined {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      /* ignore */
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return new URL(`https://${vercel}`);
  }
  return undefined;
}

/** Canonical origin string for sitemap / absolute URLs (no trailing slash). */
export function getCanonicalOrigin(): string | undefined {
  const u = getSiteOrigin();
  if (u) return u.origin;
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit).origin;
    } catch {
      return undefined;
    }
  }
  return undefined;
}
