import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_GITHUB_URL, SITE_PROFILE_NAME } from "@/lib/site";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-20 sm:py-24">
      {/* Soft backdrop so the hero isn’t flat white */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] h-48 w-[min(90vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/15 via-violet-400/12 to-sky-400/15 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 flex max-w-xl flex-col items-center gap-5 text-center">
        <h1 className="text-balance text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-3xl">
          <span className="block">
            Your Expo project,{" "}
            <span className="text-primary">configured in minutes.</span>
          </span>
          <span className="mt-2 block text-lg font-semibold leading-snug text-foreground/90 sm:text-xl">
            React Native Expo stack by{" "}
            <a
              href={SITE_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline decoration-primary/35 underline-offset-[3px] transition-colors hover:decoration-primary"
            >
              {SITE_PROFILE_NAME}
            </a>
            .
          </span>
        </h1>

        <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          Same choices as the companion Expo template → copy a paste-ready{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em] text-foreground">.env</code>{" "}
          or download a real project <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em]">.zip</code>{" "}
          from <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em]">/api/generate</code> when the
          server can read the template (see <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8em]">.env.example</code>
          ). <strong className="text-foreground">Closed source</strong> for now.
        </p>

        <Button asChild size="default" className="mt-1 sm:h-10 sm:px-6">
          <Link href="/create">
            Start wizard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
