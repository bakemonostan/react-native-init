import type { CSSProperties } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SITE_GITHUB_URL, SITE_PROFILE_NAME } from "@/lib/site";
import type { LucideIcon } from "lucide-react";
import {
  Download,
  Layers,
  Lock,
  Palette,
  Repeat2,
  Shapes,
  ToggleLeft,
} from "lucide-react";

type FeatureAccent = {
  /** Hue for soft card glow (SSR-stable) */
  hue: number;
  iconBg: string;
  iconClass: string;
};

function cardGlowStyle(hue: number): CSSProperties {
  return {
    boxShadow: `0 22px 52px -14px hsla(${hue}, 78%, 52%, 0.35), 0 10px 28px -10px hsla(${hue}, 70%, 48%, 0.22)`,
  };
}

const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: FeatureAccent;
  /** lg+ 12-col bento placement */
  bentoClass: string;
}[] = [
  {
    icon: Layers,
    title: "Navigation (real template)",
    description:
      "Expo Router tabs are the shell; drawer patterns live in sample tab screens — the wizard records intent, not a fake folder tree.",
    accent: {
      hue: 217,
      iconBg: "bg-sky-500/20 dark:bg-sky-400/15",
      iconClass: "text-sky-600 dark:text-sky-400",
    },
    bentoClass: "lg:col-span-6",
  },
  {
    icon: Lock,
    title: "Auth: mock or API",
    description:
      "Matches SecureStore tokens, services/authBackend.ts, and EXPO_PUBLIC_AUTH_MODE — login, register, forgot + OTP flows already in the template.",
    accent: {
      hue: 271,
      iconBg: "bg-violet-500/20 dark:bg-violet-400/15",
      iconClass: "text-violet-600 dark:text-violet-400",
    },
    bentoClass: "lg:col-span-6",
  },
  {
    icon: Repeat2,
    title: "Axios + TanStack Query",
    description:
      "api/config.ts interceptors, QueryClientProvider, typed helpers — no alternate fetch-only or “no API” variant in the shipped mobile repo.",
    accent: {
      hue: 331,
      iconBg: "bg-fuchsia-500/20 dark:bg-fuchsia-400/15",
      iconClass: "text-fuchsia-600 dark:text-fuchsia-400",
    },
    bentoClass: "lg:col-span-4",
  },
  {
    icon: Palette,
    title: "Theme + THEME_MODE",
    description:
      "Dark/light/system maps to .env; design tokens live under theme/ — primary hex in the wizard is a reference comment, not env-driven tokens yet.",
    accent: {
      hue: 38,
      iconBg: "bg-amber-500/25 dark:bg-amber-400/15",
      iconClass: "text-amber-700 dark:text-amber-400",
    },
    bentoClass: "lg:col-span-3",
  },
  {
    icon: ToggleLeft,
    title: "Extras that actually ship",
    description:
      "Toasts, feature flags, debounce, media permissions hook, keyboard, i18n context (en/es), deep-link scaffold — push is the only extra env toggle today.",
    accent: {
      hue: 165,
      iconBg: "bg-emerald-500/20 dark:bg-emerald-400/15",
      iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    bentoClass: "lg:col-span-5",
  },
  {
    icon: Shapes,
    title: "SVG icons (SVGR · typed)",
    description:
      "Drop .svg files under assets/icons/my-icons/ — Metro + react-native-svg-transformer ship them as components; npm install regenerates the typed SvgIcon registry (postinstall). Vector packs stay on IconComponent (@expo/vector-icons).",
    accent: {
      hue: 14,
      iconBg: "bg-orange-500/20 dark:bg-orange-400/15",
      iconClass: "text-orange-600 dark:text-orange-400",
    },
    bentoClass: "lg:col-span-5",
  },
  {
    icon: Download,
    title: "Copy .env or download ZIP",
    description:
      "The Generate step copies the full .env snippet, or POST /api/generate returns a zip of the template plus that .env when EXPO_TEMPLATE_PATH, EXPO_TEMPLATE_ARCHIVE_URL (optionally EXPO_TEMPLATE_SUBPATH for a monorepo), or a dev sibling folder is configured.",
    accent: {
      hue: 199,
      iconBg: "bg-cyan-500/20 dark:bg-cyan-400/15",
      iconClass: "text-cyan-600 dark:text-cyan-400",
    },
    bentoClass: "lg:col-span-7",
  },
];

export function FeatureSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 bg-linear-to-b from-muted/40 via-background to-muted/25">
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-linear-to-br from-primary/20 via-fuchsia-400/15 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-linear-to-bl from-sky-400/15 via-transparent to-emerald-400/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl space-y-10">
        <div className="space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            What the Expo template already gives you
          </h2>
          <p className="mx-auto max-w-3xl text-balance text-muted-foreground">
            These cards describe the{" "}
            <strong className="text-foreground">my-react-native-expo-template</strong> stack —
            same React Native Expo choices as{" "}
            <a
              href={SITE_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:text-primary/90"
            >
              {SITE_PROFILE_NAME}
            </a>
            . Real files, real scripts — no vaporware checkboxes.
          </p>
        </div>

        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:gap-5",
            "md:grid-cols-2",
            "lg:grid-cols-12 lg:gap-6",
          )}
        >
          {FEATURES.map((feature) => (
            <Card
              key={feature.title}
              className={cn(
                "relative flex h-full min-h-0 flex-col border border-border/60 bg-background/85 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border",
                "col-span-1",
                feature.bentoClass,
              )}
              style={cardGlowStyle(feature.accent.hue)}
            >
              <CardContent className="flex flex-1 flex-col space-y-3 p-6 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10",
                      feature.accent.iconBg,
                    )}
                  >
                    <feature.icon
                      className={cn("h-5 w-5 sm:h-6 sm:w-6", feature.accent.iconClass)}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <p className="text-sm font-semibold leading-snug sm:text-base">
                      {feature.title}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px] lg:text-base lg:leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
