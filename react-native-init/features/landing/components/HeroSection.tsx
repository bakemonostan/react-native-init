import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Archive,
  ArrowRightLeft,
  Cable,
  Layers,
  Shapes,
} from "lucide-react";

const DEV_BADGES = [
  { label: "Expo", className: "border-sky-500/40 bg-sky-500/12 text-sky-900 dark:text-sky-100" },
  { label: "TypeScript", className: "border-blue-500/40 bg-blue-500/12 text-blue-900 dark:text-blue-100" },
  { label: "Router · Query · Zustand", className: "border-violet-500/40 bg-violet-500/12 text-violet-900 dark:text-violet-100" },
];

/** One screen-readable summary — dense rows, distinct accents, tight corners (no “bubble” cards). */
const AT_A_GLANCE: {
  icon: LucideIcon;
  title: string;
  blurb: string;
  iconWrap: string;
}[] = [
  {
    icon: Layers,
    title: "Navigation",
    blurb: "Expo Router shell · tabs · drawer patterns in-repo",
    iconWrap: "bg-sky-500/15 text-sky-700 ring-1 ring-sky-500/25 dark:text-sky-300",
  },
  {
    icon: Cable,
    title: "Networking",
    blurb: "Axios + TanStack Query — interceptors & typed client",
    iconWrap: "bg-violet-500/15 text-violet-700 ring-1 ring-violet-500/25 dark:text-violet-300",
  },
  {
    icon: ArrowRightLeft,
    title: "Auth & theme",
    blurb: "Mock or API · SecureStore-shaped flows · THEME_MODE",
    iconWrap: "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/25 dark:text-emerald-300",
  },
  {
    icon: Shapes,
    title: "SVG pipeline",
    blurb: "SVGR · typed SvgIcon · registry on npm install",
    iconWrap: "bg-orange-500/15 text-orange-800 ring-1 ring-orange-500/25 dark:text-orange-300",
  },
  {
    icon: Archive,
    title: "What you export",
    blurb: "Paste-ready .env · or ZIP from /api/generate",
    iconWrap: "bg-cyan-500/15 text-cyan-800 ring-1 ring-cyan-500/25 dark:text-cyan-300",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 px-6 py-16 sm:py-20 lg:py-24">
      {/* Blueprint-style grid — stays static, no extra deps */}
      <div
        className="hero-blueprint-grid pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-background via-transparent to-muted/30 dark:from-background dark:to-muted/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[18%] h-[min(22rem,70vw)] w-[min(40rem,92vw)] -translate-x-1/2 rounded-full bg-linear-to-r from-primary/18 via-fuchsia-400/14 to-cyan-400/18 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,22rem)] lg:items-start lg:gap-14 xl:gap-16">
          {/* Left: proposition */}
          <div className="flex flex-col gap-5 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <span className="rounded-md border border-border/70 bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shadow-sm backdrop-blur-sm">
                Expo stack configurator
              </span>
              {DEV_BADGES.map((b) => (
                <span
                  key={b.label}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm backdrop-blur-sm",
                    b.className,
                  )}
                >
                  {b.label}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.35rem] lg:leading-[1.15]">
                <span className="block">
                  Ship a configured{" "}
                  <span className="bg-linear-to-r from-primary via-fuchsia-600 to-cyan-600 bg-clip-text text-transparent dark:from-primary dark:via-fuchsia-400 dark:to-cyan-400">
                    Expo codebase
                  </span>
                  , not a checklist slide.
                </span>
              </h1>
              <p className="text-base font-medium leading-snug text-foreground/85 sm:text-lg">
                Walk the wizard → aligned{" "}
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.88em] text-foreground">
                  .env
                </code>{" "}
                + optional project{" "}
                <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.88em]">.zip</code>
                . Same mental model as the mobile template you actually run.
              </p>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground lg:mx-0">
                Template is{" "}
                <strong className="text-foreground">closed source</strong> for now — this site is the
                honest surface area: routing, data layer, auth paths, SVG tooling, and exports.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="h-11 px-7 shadow-md">
                <Link href="/create">
                  Start wizard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <span className="text-xs text-muted-foreground">
                ~5 min · nothing to wire by hand first
              </span>
            </div>
          </div>

          {/* Right: glance panel — compact “product card”, not oversized pills */}
          <aside className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
            <div className="rounded-xl border border-border/70 bg-background/75 p-1 shadow-lg shadow-black/5 backdrop-blur-md dark:bg-background/55 dark:shadow-black/20">
              <div className="rounded-[inherit] border border-border/40 bg-muted/25 p-4 dark:bg-muted/15">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  At a glance
                </p>
                <ul className="flex flex-col gap-2">
                  {AT_A_GLANCE.map((row) => (
                    <li
                      key={row.title}
                      className="flex gap-3 rounded-lg border border-border/60 bg-background/90 px-3 py-2.5 shadow-sm dark:bg-background/70"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                          row.iconWrap,
                        )}
                      >
                        <row.icon className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-sm font-semibold leading-none text-foreground">{row.title}</p>
                        <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{row.blurb}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground lg:text-left">
              Details below in the feature grid — scroll when you want the essay version.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
