import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import {
  getSiteOrigin,
  SITE_DESCRIPTION,
  SITE_GITHUB_URL,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_OG_IMAGE_PATH,
  SITE_PROFILE_NAME,
  SITE_TWITTER_HANDLE,
} from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteOrigin = getSiteOrigin();

export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: siteOrigin } : {}),
  title: {
    default: `${SITE_NAME} — Expo stack configurator`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_PROFILE_NAME, url: SITE_GITHUB_URL }],
  keywords: [...SITE_KEYWORDS],
  creator: SITE_PROFILE_NAME,
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Expo stack configurator`,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE_PATH, alt: `${SITE_NAME} logo` }],
    ...(siteOrigin ? { url: siteOrigin.href } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Expo stack configurator`,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE_PATH],
    creator: `@${SITE_TWITTER_HANDLE}`,
    site: `@${SITE_TWITTER_HANDLE}`,
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(siteOrigin ? { alternates: { canonical: siteOrigin.href } } : {}),
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
