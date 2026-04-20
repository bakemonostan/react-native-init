"use client";

import { EnvSnippetPreview } from "@/features/wizard/components/EnvSnippetPreview";
import {
  WizardOptionCard,
  type WizardOptionBadge,
} from "@/features/wizard/components/WizardOptionCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { previewBasicsAndNavigationEnv } from "@/lib/buildEnvSnippet";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Navigation, ScaffoldConfig } from "../../types";

interface Props {
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
}

const OPTIONS: {
  value: Navigation;
  label: string;
  blurb: string;
  badge: WizardOptionBadge;
}[] = [
  {
    value: "tabs",
    label: "Tabs shell",
    blurb: "Bottom tabs for the signed-in app — matches the repo default.",
    badge: "in-repo",
  },
  {
    value: "tabs+drawer",
    label: "Tabs + drawers",
    blurb: "Tab root with drawer demos nested inside select screens.",
    badge: "in-repo",
  },
  {
    value: "drawer",
    label: "Root drawer",
    blurb: "Product-style drawer at root — not the default layout; refactor layouts after clone.",
    badge: "partial",
  },
  {
    value: "stack",
    label: "Stack-first",
    blurb: "Heavy stack navigation — auth stack exists; home is still tabs until you refactor.",
    badge: "partial",
  },
];

export function NavigationStep({ config, onChange }: Props) {
  const [pathsOpen, setPathsOpen] = useState(false);
  const [snippetOpen, setSnippetOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Navigation</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          The template ships Expo Router with a tabbed signed-in shell and an{" "}
          <span className="font-mono text-xs">(auth)</span> stack. Pick the label that matches what
          you intend to ship — it is written to{" "}
          <span className="font-mono text-xs">WIZARD_NAV</span> in your generated env snippet.
        </p>
      </div>

      <Collapsible open={pathsOpen} onOpenChange={setPathsOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-border/70 bg-muted/15 px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">
          Where this lives in the repo
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", pathsOpen && "rotate-180")}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-2 space-y-1.5 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <li>
              <code className="font-mono text-[11px] text-foreground/90">
                app/(app)/(tabs)/_layout.tsx
              </code>{" "}
              — bottom tabs
            </li>
            <li>
              <code className="font-mono text-[11px] text-foreground/90">app/(auth)/</code> — auth
              stack screens
            </li>
            <li>
              Nested{" "}
              <code className="font-mono text-[11px] text-foreground/90">
                createDrawerNavigator
              </code>{" "}
              inside some tab routes (not root)
            </li>
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <div
        className="grid auto-rows-[minmax(0,1fr)] grid-cols-1 items-stretch gap-4 sm:grid-cols-2"
        role="radiogroup"
        aria-label="Navigation layout after clone"
      >
        {OPTIONS.map((opt, i) => (
          <WizardOptionCard
            key={opt.value}
            glowIndex={i}
            badge={opt.badge}
            title={opt.label}
            description={opt.blurb}
            selected={config.navigation === opt.value}
            onSelect={() => onChange({ navigation: opt.value })}
          />
        ))}
      </div>

      <Collapsible open={snippetOpen} onOpenChange={setSnippetOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/35 hover:text-foreground">
          Live .env snippet (basics + WIZARD_NAV)
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", snippetOpen && "rotate-180")}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <EnvSnippetPreview
            title="Preview"
            content={previewBasicsAndNavigationEnv(config)}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
