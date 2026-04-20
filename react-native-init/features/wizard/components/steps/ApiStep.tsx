"use client";

import { WizardOptionCard, type WizardOptionBadge } from "@/features/wizard/components/WizardOptionCard";
import type { ApiLayer, ScaffoldConfig } from "../../types";

interface Props {
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
}

const OPTIONS: {
  value: ApiLayer;
  title: string;
  description: string;
  badge: WizardOptionBadge;
}[] = [
  {
    value: "axios",
    title: "Axios",
    description:
      "EXPO_PUBLIC_HTTP_CLIENT=axios — Axios instance in repo; default layout still mounts React Query for queries you keep.",
    badge: "in-repo",
  },
  {
    value: "axios+rq",
    title: "Axios + TanStack Query",
    description:
      "Default: api/config.ts, QueryClientProvider, services/authBackend.ts — full stack in the template.",
    badge: "in-repo",
  },
  {
    value: "fetch",
    title: "Fetch API",
    description:
      "EXPO_PUBLIC_HTTP_CLIENT=fetch — api/fetchClient.ts ships with auth header + 401 handling; wire screens to it.",
    badge: "in-repo",
  },
  {
    value: "none",
    title: "None",
    description:
      "EXPO_PUBLIC_HTTP_CLIENT=none — explicit opt-out flag; auth mock still works; add networking when you need it.",
    badge: "in-repo",
  },
];

export function ApiStep({ config, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">API layer</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Choices map to <span className="font-mono text-xs">EXPO_PUBLIC_HTTP_CLIENT</span> in the Expo
          template (see <span className="font-mono text-xs">config/featureFlags.ts</span> and{" "}
          <span className="font-mono text-xs">api/fetchClient.ts</span>). Auth HTTP still uses Axios in{" "}
          <span className="font-mono text-xs">services/authBackend.ts</span> until you refactor that module.
        </p>
      </div>

      <div
        className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-4 sm:grid-cols-2"
        role="radiogroup"
        aria-label="API and data fetching after clone"
      >
        {OPTIONS.map((opt, i) => (
          <WizardOptionCard
            key={opt.value}
            glowIndex={i}
            badge={opt.badge}
            title={opt.title}
            description={opt.description}
            selected={config.apiLayer === opt.value}
            onSelect={() => onChange({ apiLayer: opt.value })}
          />
        ))}
      </div>
    </div>
  );
}
