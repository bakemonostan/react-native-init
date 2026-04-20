"use client";

import { EnvSnippetPreview } from "@/features/wizard/components/EnvSnippetPreview";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { previewBasicsAndNavigationEnv } from "@/lib/buildEnvSnippet";
import {
  deriveBasicsFromAppName,
  isPlaceholderBundleId,
} from "@/lib/deriveFromAppName";
import type { BasicsField } from "@/lib/wizardValidation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { ScaffoldConfig } from "../../types";

function patchAppName(
  nextAppName: string,
  config: ScaffoldConfig,
): Partial<ScaffoldConfig> {
  const prev = config.appName;
  const prevDerived = deriveBasicsFromAppName(prev);
  const nextDerived = deriveBasicsFromAppName(nextAppName);
  const patch: Partial<ScaffoldConfig> = { appName: nextAppName };
  if (config.slug === prevDerived.slug) {
    patch.slug = nextDerived.slug;
  }
  if (config.scheme === prevDerived.scheme) {
    patch.scheme = nextDerived.scheme;
  }
  if (
    config.bundleId === prevDerived.bundleId ||
    isPlaceholderBundleId(config.bundleId)
  ) {
    patch.bundleId = nextDerived.bundleId;
  }
  return patch;
}

interface Props {
  config: ScaffoldConfig;
  onChange: (patch: Partial<ScaffoldConfig>) => void;
  fieldErrors?: Partial<Record<BasicsField, string>>;
}

export function BasicsStep({ config, onChange, fieldErrors }: Props) {
  const err = (key: BasicsField) => fieldErrors?.[key];
  const [techOpen, setTechOpen] = useState(false);

  const suggested = useMemo(
    () => deriveBasicsFromAppName(config.appName),
    [config.appName],
  );

  const matchesSuggested =
    config.slug === suggested.slug &&
    config.scheme === suggested.scheme &&
    (config.bundleId === suggested.bundleId ||
      isPlaceholderBundleId(config.bundleId));

  const applySuggestedIds = () => {
    onChange({
      slug: suggested.slug,
      scheme: suggested.scheme,
      bundleId: suggested.bundleId,
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Project basics</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          These land in your Expo clone&apos;s <span className="font-mono text-xs">.env</span> so
          display name, IDs, and deep links stay consistent. Editing{" "}
          <strong className="text-foreground">App display name</strong> updates slug, scheme, and
          bundle while they still match the suggested values — change any of those fields manually
          to keep a custom value.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="appName" className="text-sm font-medium">
            App display name
          </Label>
          <Input
            id="appName"
            placeholder="My App"
            value={config.appName}
            onChange={(e) => onChange(patchAppName(e.target.value, config))}
            aria-invalid={!!err("appName")}
            className="h-11 rounded-xl border-border/80 bg-zinc-50/50"
          />
          {err("appName") ? (
            <p className="text-xs text-destructive">{err("appName")}</p>
          ) : null}

          <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-muted/25 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0 space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                From this display name
              </p>
              <p className="break-all font-mono text-[11px] leading-relaxed text-foreground/90">
                <span className="text-muted-foreground">slug</span> {suggested.slug}
                <span className="mx-1.5 text-border">·</span>
                <span className="text-muted-foreground">scheme</span> {suggested.scheme}
                <span className="mx-1.5 text-border">·</span>
                <span className="text-muted-foreground">bundle</span> {suggested.bundleId}
              </p>
              {matchesSuggested ? (
                <p className="text-[11px] text-muted-foreground">
                  Matches the fields below — change the name to auto-update, or edit a field to lock it.
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Fields below differ — click apply to overwrite slug, scheme, and bundle with these values.
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shrink-0 self-start sm:self-center"
              onClick={applySuggestedIds}>
              Apply to slug, scheme &amp; bundle
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bundleId" className="text-sm font-medium">
            Bundle / application ID
          </Label>
          <Input
            id="bundleId"
            placeholder="com.example.myapp"
            value={config.bundleId}
            onChange={(e) => onChange({ bundleId: e.target.value })}
            aria-invalid={!!err("bundleId")}
            className="h-11 rounded-xl border-border/80 bg-zinc-50/50"
          />
          {err("bundleId") ? (
            <p className="text-xs text-destructive">{err("bundleId")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-sm font-medium">
            Slug
          </Label>
          <Input
            id="slug"
            placeholder="my-app"
            value={config.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            aria-invalid={!!err("slug")}
            className="h-11 rounded-xl border-border/80 bg-zinc-50/50"
          />
          {err("slug") ? <p className="text-xs text-destructive">{err("slug")}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheme" className="text-sm font-medium">
            URL scheme
          </Label>
          <Input
            id="scheme"
            placeholder="myapp"
            value={config.scheme}
            onChange={(e) => onChange({ scheme: e.target.value })}
            aria-invalid={!!err("scheme")}
            className="h-11 rounded-xl border-border/80 bg-zinc-50/50"
          />
          {err("scheme") ? <p className="text-xs text-destructive">{err("scheme")}</p> : null}
        </div>
      </div>

      <Collapsible open={techOpen} onOpenChange={setTechOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/35 hover:text-foreground">
          Technical details &amp; live snippet
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", techOpen && "rotate-180")}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Maps to{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              APP_DISPLAY_NAME
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              EXPO_PUBLIC_SLUG
            </code>
            ,{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              EXPO_PUBLIC_SCHEME
            </code>
            , and the same reverse-DNS string for{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              IOS_BUNDLE_ID
            </code>{" "}
            &amp;{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
              ANDROID_PACKAGE
            </code>{" "}
            until you split platforms manually.
          </p>
          <EnvSnippetPreview
            title="Preview — basics + nav placeholder"
            content={previewBasicsAndNavigationEnv(config)}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
