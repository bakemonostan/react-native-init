"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  BASICS_FIELDS,
  type BasicsField,
  validateBasics,
} from "@/lib/wizardValidation";
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
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

const ACCENT = {
  activeRow: "bg-sky-500/[0.08] text-foreground ring-1 ring-sky-500/20 shadow-[0_1px_0_rgba(15,23,42,0.04)]",
  activeBadge: "bg-sky-600 text-white shadow-sm",
  doneBadge: "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-600/25",
  idleBadge: "bg-muted text-muted-foreground",
};

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

  return (
    <div className="flex min-h-screen flex-1 bg-zinc-50">
      <nav className="hidden min-h-0 w-72 shrink-0 flex-col border-r border-border/60 bg-white p-5 shadow-[1px_0_0_rgba(15,23,42,0.03)] md:flex xl:w-80 xl:p-6">
        <div className="mb-5 space-y-0.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Configure
          </p>
          <p className="text-sm font-semibold text-foreground">Expo stack</p>
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
                  "flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? ACCENT.activeRow
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
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
            variant="ghost"
            size="sm"
            className="h-auto justify-start px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              reset();
              setBasicsFieldErrors({});
            }}
          >
            Reset wizard
          </Button>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span className="tabular-nums font-medium text-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-1 bg-muted" />
          </div>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border/60 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 md:hidden">
          <span className="min-w-0 truncate text-sm font-medium">
            {STEP_LABELS[currentStep]}
          </span>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {currentIndex + 1} / {STEP_ORDER.length}
          </span>
        </div>

        <header className="hidden border-b border-border/60 bg-white/80 px-4 py-3 backdrop-blur-sm md:block md:px-8">
          <p className="mx-auto max-w-6xl text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Step {currentIndex + 1} of {STEP_ORDER.length}
          </p>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:gap-8 sm:p-6 lg:flex-row lg:p-8">
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-border/50 bg-white p-5 shadow-[0_24px_64px_-28px_rgba(15,23,42,0.12)] sm:p-8">
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

        <footer className="mt-auto flex justify-between gap-3 border-t border-border/60 bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={isFirst}
            className="rounded-full border-border/80"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          {!isLast && (
            <Button onClick={handleNext} className="rounded-full px-6 shadow-sm">
              Continue
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
