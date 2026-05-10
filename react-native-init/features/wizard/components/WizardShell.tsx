"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BASICS_FIELDS,
  type BasicsField,
  validateBasics,
} from "@/lib/wizardValidation";
import { SITE_NAME } from "@/lib/site";
import { useWizardStore } from "../store/useWizardStore";
import {
  STEP_ORDER,
  STEP_HINTS,
  STEP_LABELS,
  type ScaffoldConfig,
  type StepId,
} from "../types";
import { StepContent } from "./StepContent";
import { SummaryPanel } from "./SummaryPanel";
import { Check, ChevronLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const ACCENT = {
  activeRow:
    "border border-sky-500/25 bg-sky-500/[0.07] text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-sky-400/20 dark:bg-sky-400/[0.08]",
  activeBadge: "bg-sky-600 text-white shadow-sm dark:bg-sky-500",
  doneBadge: "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-600/25 dark:text-emerald-300",
  idleBadge: "border border-border/50 bg-background text-muted-foreground dark:border-border/60",
};

function HomeNavButton({ className }: { className?: string }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className={cn(
        "shrink-0 rounded-lg text-muted-foreground hover:bg-muted/80 hover:text-foreground",
        className,
      )}
      aria-label="Back to home"
    >
      <Link href="/">
        <Home className="h-5 w-5" aria-hidden />
      </Link>
    </Button>
  );
}

function WizardBrand({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-[11px] font-bold tracking-tight text-primary-foreground shadow-sm"
        aria-hidden
      >
        RN
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold text-foreground">{SITE_NAME}</p>
        <p className="truncate text-[11px] text-muted-foreground">Expo stack wizard</p>
      </div>
      <span className="hidden shrink-0 rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline-block">
        Beta
      </span>
    </div>
  );
}

export function WizardShell() {
  const { config, currentStep, setConfig, setStep, nextStep, prevStep, reset } =
    useWizardStore(
      useShallow((s) => ({
        config: s.config,
        currentStep: s.currentStep,
        setConfig: s.setConfig,
        setStep: s.setStep,
        nextStep: s.nextStep,
        prevStep: s.prevStep,
        reset: s.reset,
      })),
    );

  const [basicsFieldErrors, setBasicsFieldErrors] = useState<
    Partial<Record<BasicsField, string>>
  >({});

  const patchConfig = useCallback(
    (patch: Partial<ScaffoldConfig>) => {
      setConfig(patch);
      if (currentStep !== "basics") return;
      const touched = BASICS_FIELDS.filter((k) => k in patch);
      if (!touched.length) return;
      setBasicsFieldErrors((prev) => {
        const next = { ...prev };
        for (const k of touched) delete next[k];
        return next;
      });
    },
    [currentStep, setConfig],
  );

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const progress = ((currentIndex + 1) / STEP_ORDER.length) * 100;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === STEP_ORDER.length - 1;

  const handleNext = () => {
    if (currentStep === "basics") {
      const result = validateBasics(config);
      if (!result.ok) {
        setBasicsFieldErrors(result.errors);
        toast.error("Fix Basics", {
          description: "Check the fields marked in red before continuing.",
        });
        return;
      }
      setBasicsFieldErrors({});
    }
    nextStep();
  };

  const handleReset = useCallback(() => {
    reset();
    setBasicsFieldErrors({});
    toast.success("Wizard reset", {
      description: "All choices cleared.",
    });
  }, [reset]);

  return (
    <div className="flex min-h-screen flex-1 bg-zinc-50 bg-[radial-gradient(ellipse_120%_90%_at_50%_-8%,rgba(14,165,233,0.07),transparent_58%)] dark:bg-zinc-950 dark:bg-[radial-gradient(ellipse_120%_90%_at_50%_-8%,rgba(56,189,248,0.09),transparent_58%)]">
      <nav className="hidden min-h-0 w-72 shrink-0 flex-col border-r border-border/40 bg-white p-5 shadow-[2px_0_24px_-12px_rgba(15,23,42,0.06)] md:flex xl:w-80 xl:p-6 dark:bg-card/80 dark:shadow-none">
        <div className="mb-6 flex items-start gap-2">
          <HomeNavButton />
          <WizardBrand className="min-w-0 flex-1" />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {STEP_ORDER.map((step, i) => {
            const isDone = i < currentIndex;
            const isActive = step === currentStep;
            return (
              <button
                key={step}
                type="button"
                onClick={() => setStep(step as StepId)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? ACCENT.activeRow
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    isActive
                      ? ACCENT.activeBadge
                      : isDone
                        ? ACCENT.doneBadge
                        : ACCENT.idleBadge,
                  )}
                >
                  {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1 leading-snug">
                  <span className="block font-medium text-foreground">
                    {STEP_LABELS[step]}
                  </span>
                  {isActive ? (
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      {STEP_HINTS[step]}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-3 border-t border-border/60 pt-5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 border-border/80 font-medium"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums font-medium text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-1.5 bg-muted/90" />
          </div>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/40 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 md:hidden dark:bg-card/95">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <HomeNavButton className="-ml-1" />
            <span className="min-w-0 truncate text-sm font-semibold text-foreground">
              {STEP_LABELS[currentStep]}
            </span>
          </div>
          <span className="shrink-0 tabular-nums text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {currentIndex + 1} / {STEP_ORDER.length}
          </span>
        </div>

        <header className="hidden border-b border-border/40 bg-white/95 px-4 py-3.5 backdrop-blur-md md:block md:px-8 dark:bg-card/90">
          <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="justify-self-start flex min-w-0 items-center gap-1">
              <HomeNavButton />
              <WizardBrand className="min-w-0" />
            </div>
            <p className="justify-self-center text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Step {currentIndex + 1} of {STEP_ORDER.length}
            </p>
            <div className="justify-self-end tabular-nums text-xs font-medium text-muted-foreground">
              <span className="text-foreground">{Math.round(progress)}%</span>
              <span className="sr-only"> complete</span>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:flex-row lg:gap-8 lg:p-8 lg:pb-10">
          <div className="min-w-0 flex-1">
            <div className="rounded-xl border border-border/45 bg-white p-5 shadow-[0_16px_48px_-20px_rgba(15,23,42,0.1)] ring-1 ring-black/[0.03] sm:p-8 dark:bg-card dark:ring-white/[0.06]">
              <StepContent
                step={currentStep}
                config={config}
                onChange={patchConfig}
                onEditStep={setStep}
                basicsFieldErrors={
                  currentStep === "basics" ? basicsFieldErrors : undefined
                }
              />
            </div>
          </div>
          <SummaryPanel config={config} />
        </div>

        <footer className="mt-auto border-t border-border/45 bg-white/95 backdrop-blur-md dark:bg-card/95">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={isFirst}
              className="h-11 rounded-xl px-4 text-muted-foreground hover:bg-muted/80 hover:text-foreground disabled:opacity-40"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            {!isLast && (
              <Button
                onClick={handleNext}
                className="h-11 rounded-xl px-8 text-base font-semibold shadow-[0_8px_24px_-6px_rgba(15,23,42,0.35)] ring-1 ring-primary/15 transition-[box-shadow,transform] hover:shadow-[0_12px_28px_-8px_rgba(15,23,42,0.4)] active:translate-y-px dark:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)]"
              >
                Continue
                <ChevronRight className="ml-1.5 h-4 w-4 opacity-90" />
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
