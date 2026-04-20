"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WizardOptionCard } from "@/features/wizard/components/WizardOptionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Auth, BackendProvider, ScaffoldConfig } from "../../types";

interface Props {
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
}

const BACKEND_OPTIONS: {
  value: BackendProvider;
  label: string;
  hint: string;
}[] = [
  {
    value: "none",
    label: "None",
    hint: "No hosted backend in .env yet — mock auth or add services later.",
  },
  {
    value: "supabase",
    label: "Supabase",
    hint: "Snippet adds Supabase URL + anon key placeholders; install the SDK in the app.",
  },
  {
    value: "custom",
    label: "Custom backend",
    hint: "Your own API — we prefill EXPO_PUBLIC_API_BASE_URL from the URL below.",
  },
];

const AUTH_OPTIONS: { value: Auth; label: string; description: string }[] = [
  {
    value: "mock",
    label: "Mock (local dev)",
    description:
      "EXPO_PUBLIC_AUTH_MODE=mock — any password works; tokens still go to SecureStore so the stack matches prod.",
  },
  {
    value: "api",
    label: "API / JWT-shaped backend",
    description:
      "EXPO_PUBLIC_AUTH_MODE=api — implement routes in services/authBackend.ts (login, register, /auth/me, etc.).",
  },
];

export function AuthStep({ config, onChange }: Props) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Backend &amp; authentication</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Pick where data and auth will eventually live. The Expo template does not install Supabase
          for you — this step only writes the right <span className="font-mono text-xs">.env</span>{" "}
          keys so you can wire clients after clone.
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="backend-provider"
          className="text-xs font-semibold tracking-wide text-sky-700 dark:text-sky-400"
        >
          Backend provider
        </Label>
        <Select
          value={config.backendProvider}
          onValueChange={(value) =>
            onChange({ backendProvider: value as BackendProvider })
          }
        >
          <SelectTrigger
            id="backend-provider"
            size="default"
            className="h-11 w-full min-w-0 rounded-xl border-border/80 bg-zinc-50/50 shadow-none md:text-sm"
          >
            <SelectValue placeholder="Choose backend" />
          </SelectTrigger>
          <SelectContent>
            {BACKEND_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {BACKEND_OPTIONS.find((o) => o.value === config.backendProvider)?.hint}
        </p>
      </div>

      {config.backendProvider === "custom" ? (
        <div className="space-y-2">
          <Label htmlFor="customBackendUrl" className="text-sm font-medium">
            Base URL (local or remote)
          </Label>
          <Input
            id="customBackendUrl"
            type="url"
            inputMode="url"
            placeholder="https://api.example.com"
            value={config.customBackendUrl}
            onChange={(e) => onChange({ customBackendUrl: e.target.value })}
            className="h-11 rounded-xl border-border/80 bg-zinc-50/50"
          />
        </div>
      ) : null}

      <div className="space-y-4 border-t border-border/60 pt-6">
        <h3 className="text-sm font-semibold text-foreground">Sign-in mode</h3>
        <p className="text-xs text-muted-foreground">
          Same two modes as the template:{" "}
          <code className="rounded bg-muted px-1 font-mono text-[11px]">mock</code> vs{" "}
          <code className="rounded bg-muted px-1 font-mono text-[11px]">api</code>. With Supabase you
          will often use <span className="font-medium text-foreground">api</span> once your edge or
          REST layer issues sessions.
        </p>

        <div
          className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-4 sm:grid-cols-2"
          role="radiogroup"
          aria-label="Authentication mode"
        >
          {AUTH_OPTIONS.map((opt, i) => (
            <WizardOptionCard
              key={opt.value}
              glowIndex={i}
              badge="in-repo"
              title={opt.label}
              description={opt.description}
              selected={config.auth === opt.value}
              onSelect={() => onChange({ auth: opt.value })}
            />
          ))}
        </div>
      </div>

      {config.auth === "api" ? (
        <p className="text-xs text-muted-foreground rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
          Optional native Google: see template{" "}
          <code className="rounded bg-background px-1 font-mono text-[11px]">utils/googleAuth.ts</code>{" "}
          + env client IDs — not toggled here; wire after your backend issues sessions.
        </p>
      ) : null}
    </div>
  );
}
