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
  iconBg: string;
  iconClass: string;
  /** Colored left edge — reads “tooling” without neon glow shadows */
  stripe: string;
};

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
      stripe: "border-l-sky-500",
      iconBg: "bg-sky-500/12 dark:bg-sky-400/12",
      iconClass: "text-sky-700 dark:text-sky-400",
    },
    bentoClass: "lg:col-span-6",
  },
  {
    icon: Lock,
    title: "Auth: mock or API",
    description:
      "Matches SecureStore tokens, services/authBackend.ts, and EXPO_PUBLIC_AUTH_MODE — login, register, forgot + OTP flows already in the template.",
    accent: {
      stripe: "border-l-violet-500",
      iconBg: "bg-violet-500/12 dark:bg-violet-400/12",
      iconClass: "text-violet-700 dark:text-violet-400",
    },
    bentoClass: "lg:col-span-6",
  },
  {
    icon: Repeat2,
    title: "Axios + TanStack Query",
    description:
      "api/config.ts interceptors, QueryClientProvider, typed helpers — no alternate fetch-only or “no API” variant in the shipped mobile repo.",
    accent: {
      stripe: "border-l-fuchsia-500",
      iconBg: "bg-fuchsia-500/12 dark:bg-fuchsia-400/12",
      iconClass: "text-fuchsia-800 dark:text-fuchsia-400",
    },
    bentoClass: "lg:col-span-4",
  },
  {
    icon: Palette,
    title: "Theme + THEME_MODE",
    description:
      "Dark/light/system maps to .env; design tokens live under theme/ — primary hex in the wizard is a reference comment, not env-driven tokens yet.",
    accent: {
      stripe: "border-l-amber-500",
      iconBg: "bg-amber-500/14 dark:bg-amber-400/12",
      iconClass: "text-amber-900 dark:text-amber-400",
    },
    bentoClass: "lg:col-span-3",
  },
  {
    icon: ToggleLeft,
    title: "Extras that actually ship",
    description:
      "Toasts, feature flags, debounce, media permissions hook, keyboard, i18n context (en/es), deep-link scaffold — push is the only extra env toggle today.",
    accent: {
      stripe: "border-l-emerald-500",
      iconBg: "bg-emerald-500/12 dark:bg-emerald-400/12",
      iconClass: "text-emerald-800 dark:text-emerald-400",
    },
    bentoClass: "lg:col-span-5",
  },
  {
    icon: Shapes,
    title: "SVG icons (SVGR · typed)",
    description:
      "Drop .svg files under assets/icons/my-icons/ — Metro + react-native-svg-transformer ship them as components; npm install regenerates the typed SvgIcon registry (postinstall). Vector packs stay on IconComponent (@expo/vector-icons).",
    accent: {
      stripe: "border-l-orange-500",
      iconBg: "bg-orange-500/12 dark:bg-orange-400/12",
      iconClass: "text-orange-800 dark:text-orange-400",
    },
    bentoClass: "lg:col-span-5",
  },
  {
    icon: Download,
    title: "Copy .env or download ZIP",
    description:
      "The Generate step copies the full .env snippet, or POST /api/generate returns a zip of the template plus that .env when EXPO_TEMPLATE_PATH, EXPO_TEMPLATE_ARCHIVE_URL (optionally EXPO_TEMPLATE_SUBPATH for a monorepo), or a dev sibling folder is configured.",
    accent: {
      stripe: "border-l-cyan-500",
      iconBg: "bg-cyan-500/12 dark:bg-cyan-400/12",
      iconClass: "text-cyan-800 dark:text-cyan-400",
    },
    bentoClass: "lg:col-span-7",
  },
];

export function FeatureSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-muted/35 via-background to-muted/20 px-6 py-20">
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-linear-to-br from-primary/12 via-fuchsia-400/10 to-transparent blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-linear-to-bl from-sky-400/10 via-transparent to-emerald-400/8 blur-3xl"
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
                "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/65 bg-card/90 py-0 shadow-sm ring-0 backdrop-blur-sm transition-[box-shadow,border-color] duration-200 hover:border-border hover:shadow-md",
                "border-l-4",
                feature.accent.stripe,
                "col-span-1",
                feature.bentoClass,
              )}
            >
              <CardContent className="flex flex-1 flex-col space-y-3 p-5 sm:p-6">
                <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-md ring-1 ring-border/60 dark:ring-border/80",
                      feature.accent.iconBg,
                    )}
                  >
                    <feature.icon
                      className={cn("h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5", feature.accent.iconClass)}
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="text-sm font-semibold leading-snug tracking-tight text-foreground sm:text-[15px]">
                      {feature.title}
                    </p>
                    <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm sm:leading-relaxed">
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
