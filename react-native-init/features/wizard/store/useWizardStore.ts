"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_CONFIG,
  STEP_ORDER,
  type ScaffoldConfig,
  type StepId,
} from "../types";

export type WizardStore = {
  config: ScaffoldConfig;
  currentStep: StepId;
  setConfig: (patch: Partial<ScaffoldConfig>) => void;
  setStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      currentStep: "basics" as StepId,

      setConfig: (patch) =>
        set((s) => ({ config: { ...s.config, ...patch } })),

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        const i = STEP_ORDER.indexOf(currentStep);
        if (i < STEP_ORDER.length - 1) {
          set({ currentStep: STEP_ORDER[i + 1]! });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        const i = STEP_ORDER.indexOf(currentStep);
        if (i > 0) {
          set({ currentStep: STEP_ORDER[i - 1]! });
        }
      },

      reset: () =>
        set({ config: DEFAULT_CONFIG, currentStep: "basics" }),
    }),
    {
      name: "rn-expo-wizard-v4",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        config: s.config,
        currentStep: s.currentStep,
      }),
      /** Old saves may omit newer keys — merge so toggles/env stay in sync with `DEFAULT_CONFIG`. */
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== "object") {
          return current;
        }
        const p = persisted as Partial<{
          config: Partial<ScaffoldConfig>;
          currentStep: StepId;
        }>;
        return {
          ...current,
          currentStep: p.currentStep ?? current.currentStep,
          config: { ...DEFAULT_CONFIG, ...p.config } as ScaffoldConfig,
        };
      },
    },
  ),
);
