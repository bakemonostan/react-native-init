import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  /** Service worker + precache only in production — avoids stale assets during dev */
  disable: process.env.NODE_ENV === "development",
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /**
   * `withPWA` adds a `webpack` hook. Next 16 runs `next dev` with Turbopack by default and
   * errors unless Turbopack is acknowledged. PWA is off in development, so an empty config is enough.
   * Production builds use `next build --webpack` (see package.json).
   */
  turbopack: {},
};

export default withPWA(nextConfig);
