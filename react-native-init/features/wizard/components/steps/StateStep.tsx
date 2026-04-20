"use client";

import { WizardOptionCard, type WizardOptionBadge } from "@/features/wizard/components/WizardOptionCard";
import type { ScaffoldConfig, StateManagement } from "../../types";

interface Props {
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
}

const OPTIONS: {
  value: StateManagement;
  title: string;
  description: string;
  badge: WizardOptionBadge;
}[] = [
  {
    value: "zustand",
    title: "Zustand",
    description:
      "As shipped: store/authStore.ts, zustand/middleware persist for profile fields, SecureStore for access tokens.",
    badge: "in-repo",
  },
  {
    value: "none",
    title: "None",
    description:
      "EXPO_PUBLIC_STATE_MODE=none — opt out flag in the template; Zustand files remain for you to delete or ignore when you simplify.",
    badge: "in-repo",
  },
];

export function StateStep({ config, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">State management</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          The Expo template reads <span className="font-mono text-xs">EXPO_PUBLIC_STATE_MODE</span>{" "}
          (<span className="font-mono text-xs">runtimeModes.stateMode</span> in{" "}
          <span className="font-mono text-xs">config/featureFlags.ts</span>).{" "}
          <span className="font-medium text-foreground">Zustand</span> stays the default implementation;
          <span className="font-medium text-foreground"> none</span> is an opt-out flag for gradual refactors.
        </p>
      </div>

      <div
        className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-4 sm:grid-cols-2"
        role="radiogroup"
        aria-label="State management after clone"
      >
        {OPTIONS.map((opt, i) => (
          <WizardOptionCard
            key={opt.value}
            glowIndex={i}
            badge={opt.badge}
            title={opt.title}
            description={opt.description}
            selected={config.stateManagement === opt.value}
            onSelect={() => onChange({ stateManagement: opt.value })}
          />
        ))}
      </div>
    </div>
  );
}
