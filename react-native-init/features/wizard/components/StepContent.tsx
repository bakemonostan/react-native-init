"use client";

import type { BasicsField } from "@/lib/wizardValidation";
import { ScaffoldConfig, StepId } from "../types";
import { ApiStep } from "./steps/ApiStep";
import { AuthStep } from "./steps/AuthStep";
import { BasicsStep } from "./steps/BasicsStep";
import { ExtrasStep } from "./steps/ExtrasStep";
import { GenerateStep } from "./steps/GenerateStep";
import { NavigationStep } from "./steps/NavigationStep";
import { StateStep } from "./steps/StateStep";
import { StylingStep } from "./steps/StylingStep";

interface Props {
  step: StepId;
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
  onEditStep: (step: StepId) => void;
  basicsFieldErrors?: Partial<Record<BasicsField, string>>;
}

export function StepContent({
  step,
  config,
  onChange,
  onEditStep,
  basicsFieldErrors,
}: Props) {
  switch (step) {
    case "basics":
      return (
        <BasicsStep
          config={config}
          onChange={onChange}
          fieldErrors={basicsFieldErrors}
        />
      );
    case "navigation":
      return <NavigationStep config={config} onChange={onChange} />;
    case "styling":
      return <StylingStep config={config} onChange={onChange} />;
    case "state":
      return <StateStep config={config} onChange={onChange} />;
    case "api":
      return <ApiStep config={config} onChange={onChange} />;
    case "auth":
      return <AuthStep config={config} onChange={onChange} />;
    case "extras":
      return <ExtrasStep config={config} onChange={onChange} />;
    case "generate":
      return <GenerateStep config={config} onEditStep={onEditStep} />;
    default:
      return null;
  }
}
