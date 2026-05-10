/** Public site copy — GitHub profile for attribution links */
export const SITE_GITHUB_URL = "https://github.com/bakemonostan";
export const SITE_PROFILE_NAME = "BakemonoStan";

export const SITE_X_URL = "https://x.com/BakemonoStan";
export const SITE_LINKEDIN_URL = "https://www.linkedin.com/in/omokhomionehis/";
export const SITE_CONTACT_EMAIL = "ehizomokhomion@gmail.com";

export const SITE_NAME = "RN Init";

export const SITE_DESCRIPTION =
  "Configure an Expo + React Native stack: wizard → paste-ready .env or ZIP, typed SVG pipeline (SVGR), Router, Query, auth flows — ship faster.";

export const SITE_KEYWORDS = [
  "React Native",
  "Expo",
  "Expo Router",
  "Zustand",
  "TanStack Query",
  "Axios",
  "TypeScript",
  "mobile app template",
  "environment variables",
  "SVG icons",
  "SVGR",
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
