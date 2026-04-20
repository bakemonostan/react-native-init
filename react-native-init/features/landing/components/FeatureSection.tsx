import type { CSSProperties } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_GITHUB_URL, SITE_PROFILE_NAME } from "@/lib/site";
import {
  Layers,
  Lock,
  Repeat2,
  Palette,
  ToggleLeft,
  Download,
} from "lucide-react";

/** HSLA glows — varied per card (deterministic for SSR). */
function cardGlowStyle(index: number): CSSProperties {
  const hues = [221, 271, 331, 28, 172, 199];
  const h = hues[index % hues.length];
  return {
    boxShadow: `0 20px 48px -14px hsla(${h}, 72%, 56%, 0.28), 0 8px 24px -8px hsla(${h}, 65%, 50%, 0.15)`,
  };
}

const FEATURES = [
  {
    icon: Layers,
    title: "Navigation (real template)",
    description:
      "Expo Router tabs are the shell; drawer patterns live in sample tab screens — the wizard records intent, not a fake folder tree.",
  },
  {
    icon: Lock,
    title: "Auth: mock or API",
    description:
      "Matches SecureStore tokens, services/authBackend.ts, and EXPO_PUBLIC_AUTH_MODE — login, register, forgot + OTP flows already in the template.",
  },
  {
    icon: Repeat2,
    title: "Axios + TanStack Query",
    description:
      "api/config.ts interceptors, QueryClientProvider, typed helpers — no alternate fetch-only or “no API” variant in the shipped mobile repo.",
  },
  {
    icon: Palette,
    title: "Theme + THEME_MODE",
    description:
      "Dark/light/system maps to .env; design tokens live under theme/ — primary hex in the wizard is a reference comment, not env-driven tokens yet.",
  },
  {
    icon: ToggleLeft,
    title: "Extras that actually ship",
    description:
      "Toasts, feature flags, debounce, media permissions hook, keyboard, i18n context (en/es), deep-link scaffold — push is the only extra env toggle today.",
  },
  {
    icon: Download,
    title: "Copy .env or download ZIP",
    description:
      "The Generate step copies the full .env snippet, or POST /api/generate returns a zip of the template plus that .env when EXPO_TEMPLATE_PATH, EXPO_TEMPLATE_ARCHIVE_URL (optionally EXPO_TEMPLATE_SUBPATH for a monorepo), or a dev sibling folder is configured.",
  },
];

export function FeatureSection() {
  return (
    <section className="px-6 py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            What the Expo template already gives you
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            These cards describe the <strong className="text-foreground">my-react-native-expo-template</strong>{" "}
            stack — same React Native Expo choices as{" "}
            <a
              href={SITE_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              {SITE_PROFILE_NAME}
            </a>
            . No vaporware checkboxes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Card
              key={feature.title}
              className="relative border border-border/70 bg-background/90 backdrop-blur-sm transition-shadow duration-300 hover:brightness-[1.02]"
              style={cardGlowStyle(i)}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-sm">{feature.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
