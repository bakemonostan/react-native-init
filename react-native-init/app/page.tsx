import { HeroSection } from "@/features/landing/components/HeroSection";
import { FeatureSection } from "@/features/landing/components/FeatureSection";
import { Footer } from "@/features/landing/components/Footer";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Expo stack configurator",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Expo stack configurator`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Expo stack configurator`,
    description: SITE_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSection />
      <FeatureSection />
      <Footer />
    </main>
  );
}
