/** Public site copy — GitHub profile for attribution links */
export const SITE_GITHUB_URL = "https://github.com/bakemonostan";
export const SITE_PROFILE_NAME = "Ehiz Omokhomion";

export const SITE_NAME = "RN Init";

export const SITE_DESCRIPTION =
  "Configure an Expo + React Native stack aligned with the open template: walk the wizard, copy a paste-ready .env, and ship faster.";

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
