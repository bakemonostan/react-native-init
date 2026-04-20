import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import {
  getSiteOrigin,
  SITE_DESCRIPTION,
  SITE_GITHUB_URL,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_PROFILE_NAME,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Expo stack configurator`,
    description: SITE_DESCRIPTION,
    ...(siteOrigin ? { url: siteOrigin.href } : {}),
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Expo stack configurator`,
    description: SITE_DESCRIPTION,
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
