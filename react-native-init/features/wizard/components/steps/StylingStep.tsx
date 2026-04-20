"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import {
  WizardOptionCard,
  type WizardOptionBadge,
} from "@/features/wizard/components/WizardOptionCard";
import {
  type ThemeTokenKey,
  type ThemeTokenSet,
  THEME_TOKEN_GROUPS,
  defaultThemeTokens,
  randomThemeTokens,
} from "@/lib/themeTokens";
import { cn } from "@/lib/utils";
import { DarkMode, ScaffoldConfig } from "../../types";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
}

const DARK_OPTIONS: {
  value: DarkMode;
  title: string;
  description: string;
  badge: WizardOptionBadge;
}[] = [
  {
    value: "system",
    title: "System (auto)",
    description: "Maps to THEME_MODE=auto — follows OS light/dark.",
    badge: "in-repo",
  },
  {
    value: "light",
    title: "Light only",
    description: "Maps to THEME_MODE=light.",
    badge: "in-repo",
  },
  {
    value: "dark",
    title: "Dark only",
    description: "Maps to THEME_MODE=dark.",
    badge: "in-repo",
  },
];

function humanizeTokenKey(key: ThemeTokenKey): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function isHexForColorInput(v: string): boolean {
  const s = v.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(s) || /^#[0-9A-Fa-f]{3}$/.test(s);
}

function TokenField({
  tokenKey,
  value,
  onChange,
}: {
  tokenKey: ThemeTokenKey;
  value: string;
  onChange: (v: string) => void;
}) {
  const label = humanizeTokenKey(tokenKey);
  const showPicker = isHexForColorInput(value);
  const pickerValue =
    value.length === 4
      ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`
      : value;

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <Label className="shrink-0 text-[11px] font-medium text-muted-foreground sm:w-36">
        {label}
      </Label>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {showPicker ? (
          <input
            title={`${label} color`}
            type="color"
            value={pickerValue}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="h-8 w-11 shrink-0 cursor-pointer rounded-md border border-border/80 bg-transparent p-0.5"
          />
        ) : null}
        <input
          aria-label={label}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="min-w-0 flex-1 rounded-md border border-border/80 bg-background px-2 py-1 font-mono text-[11px] text-foreground"
        />
      </div>
    </div>
  );
}

function TokenGroupsEditor({
  tokens,
  onPatch,
}: {
  tokens: ThemeTokenSet;
  onPatch: (key: ThemeTokenKey, v: string) => void;
}) {
  return (
    <div
      className="max-h-[min(28rem,65vh)] space-y-2 overflow-y-auto overscroll-contain rounded-xl border border-border/50 bg-muted/10 p-2 pr-1"
      role="region"
      aria-label="Semantic color tokens"
    >
      {THEME_TOKEN_GROUPS.map((group) => (
        <Collapsible
          key={group.id}
          defaultOpen={group.id === "base" || group.id === "primary"}
        >
          <CollapsibleTrigger
            className={cn(
              "group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold text-foreground transition-colors hover:bg-muted/50",
            )}
          >
            {group.label}
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-2 px-1 pb-2 pt-0.5 sm:grid-cols-2">
              {group.keys.map((key) => (
                <div
                  key={key}
                  className="rounded-lg border border-border/30 bg-background/90 p-2"
                >
                  <TokenField
                    tokenKey={key}
                    value={tokens[key]}
                    onChange={(v) => onPatch(key, v)}
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

export function StylingStep({ config, onChange }: Props) {
  const showBothAppearances = config.darkMode === "system";
  const [appearanceTab, setAppearanceTab] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (config.darkMode === "light") setAppearanceTab("light");
    if (config.darkMode === "dark") setAppearanceTab("dark");
  }, [config.darkMode]);

  const editingAppearance: "light" | "dark" =
    config.darkMode === "light"
      ? "light"
      : config.darkMode === "dark"
        ? "dark"
        : appearanceTab;

  const syncPrimary = useCallback(
    (hex: string) => {
      const t = config.themeTokens;
      onChange({
        primaryColor: hex,
        themeTokens: {
          light: { ...t.light, primary: hex, ring: hex },
          dark: { ...t.dark, primary: hex, ring: hex },
        },
      });
    },
    [config.themeTokens, onChange],
  );

  const patchLight = useMemo(
    () => (key: ThemeTokenKey, v: string) => {
      onChange({
        themeTokens: {
          ...config.themeTokens,
          light: { ...config.themeTokens.light, [key]: v },
        },
      });
    },
    [config.themeTokens, onChange],
  );

  const patchDark = useMemo(
    () => (key: ThemeTokenKey, v: string) => {
      onChange({
        themeTokens: {
          ...config.themeTokens,
          dark: { ...config.themeTokens.dark, [key]: v },
        },
      });
    },
    [config.themeTokens, onChange],
  );

  const resetTokens = useCallback(() => {
    onChange({ themeTokens: defaultThemeTokens(config.primaryColor) });
  }, [config.primaryColor, onChange]);

  const randomizeTokens = useCallback(() => {
    const next = randomThemeTokens();
    onChange({
      themeTokens: next,
      primaryColor: next.light.primary,
    });
  }, [onChange]);

  const activeTokens =
    editingAppearance === "light"
      ? config.themeTokens.light
      : config.themeTokens.dark;
  const activePatch =
    editingAppearance === "light" ? patchLight : patchDark;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Styling &amp; theme</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Tokens ship in <span className="font-mono text-xs">.env</span> as{" "}
          <span className="font-mono text-xs">EXPO_PUBLIC_THEME_LIGHT_*</span> /{" "}
          <span className="font-mono text-xs">DARK_*</span>. The Expo app merges them in{" "}
          <span className="font-mono text-xs">ThemeContext</span> (hex or{" "}
          <span className="font-mono text-xs">rgba()</span>).{" "}
          <span className="font-mono text-xs">EXPO_PUBLIC_BRAND_PRIMARY</span> is only a fallback if
          those vars are incomplete.
        </p>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Dark mode</Label>
        <div
          className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Dark mode preference"
        >
          {DARK_OPTIONS.map((opt, i) => (
            <WizardOptionCard
              key={opt.value}
              glowIndex={i}
              badge={opt.badge}
              title={opt.title}
              description={opt.description}
              selected={config.darkMode === opt.value}
              onSelect={() => onChange({ darkMode: opt.value })}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryColor" className="text-sm font-medium">
          {showBothAppearances
            ? "Primary (syncs token primary + ring, light + dark)"
            : "Primary (syncs token primary + ring in both token sets)"}
        </Label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            title="Primary brand color"
            id="primaryColor"
            type="color"
            value={config.primaryColor}
            onChange={(e) => syncPrimary(e.target.value.toUpperCase())}
            className="h-11 w-16 cursor-pointer rounded-xl border border-border/80 bg-transparent p-1"
          />
          <span className="font-mono text-sm text-muted-foreground">{config.primaryColor}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label className="text-sm font-medium">Semantic colors</Label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={randomizeTokens}
              className="shrink-0 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              Randomize all
            </button>
            <button
              type="button"
              onClick={resetTokens}
              className="shrink-0 rounded-lg border border-border/80 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              Reset from primary
            </button>
          </div>
        </div>

        {showBothAppearances ? (
          <div className="inline-flex rounded-lg border border-border/60 bg-muted/20 p-0.5">
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAppearanceTab(m)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  appearanceTab === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "light" ? "Light" : "Dark"} appearance
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            {config.darkMode === "light"
              ? "THEME_MODE is light-only — editing light tokens. Dark tokens still ship in .env for the template but the app stays light."
              : "THEME_MODE is dark-only — editing dark tokens. Light tokens still ship in .env for the template but the app stays dark."}
          </p>
        )}

        <TokenGroupsEditor tokens={activeTokens} onPatch={activePatch} />
      </div>
    </div>
  );
}
