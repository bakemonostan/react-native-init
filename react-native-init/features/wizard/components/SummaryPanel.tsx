"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScaffoldConfig } from "../types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  config: ScaffoldConfig;
}

export function SummaryPanel({ config }: Props) {
  const [stackOpen, setStackOpen] = useState(false);

  return (
    <aside className="hidden min-w-0 shrink-0 lg:block lg:w-64 xl:w-72">
      <div className="sticky top-6 space-y-5 rounded-2xl border border-border/50 bg-white/70 p-5 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.1)] backdrop-blur-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Summary
          </p>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Live view of choices — full detail stays in each step.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <SummaryRow label="App" value={config.appName || "—"} />
          <SummaryRow label="Bundle" value={config.bundleId || "—"} mono />
          <SummaryRow label="Slug · scheme" value={`${config.slug} · ${config.scheme}`} />
          <SummaryRow label="Nav" value={config.navigation} mono />
          <SummaryRow
            label="Theme"
            value={`${config.darkMode} · semantic tokens (light+dark)`}
          />
          <SummaryRow label="State" value={config.stateManagement} mono />
          <SummaryRow label="API" value={config.apiLayer} mono />
          <SummaryRow label="Backend" value={config.backendProvider} mono />
          <SummaryRow label="Auth" value={config.auth} />
          <SummaryRow
            label="Modules (.env)"
            value={[
              `toast ${config.useToast ? "on" : "off"}`,
              `i18n ${config.useI18n ? "on" : "off"}`,
              `flags ${config.useFeatureFlags ? "on" : "off"}`,
              `debounce ${config.useDebounce ? "on" : "off"}`,
              `media ${config.usePermissions ? "on" : "off"}`,
              `keyboard ${config.useKeyboard ? "on" : "off"}`,
              `deeplink ${config.useDeepLinking ? "on" : "off"}`,
              `push ${config.usePushNotifications ? "on" : "off"}`,
            ].join(" · ")}
            mono
          />
        </div>

        <Collapsible open={stackOpen} onOpenChange={setStackOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-lg py-1.5 text-left text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
            What ships in the template
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                stackOpen && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
              Axios + TanStack Query, Zustand, toasts, feature flags, debounce, media permissions hook,
              keyboard helpers, i18n, deep link wiring — toggle env-only pieces in Extras.
            </p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </aside>
  );
}

function SummaryRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-0.5">
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "font-medium text-foreground wrap-break-word",
          mono && "font-mono text-xs",
        )}
      >
        {value}
      </div>
    </div>
  );
}
