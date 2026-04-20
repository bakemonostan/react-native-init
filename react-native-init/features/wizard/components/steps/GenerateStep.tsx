"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { buildEnvFromWizardConfig } from "@/lib/buildEnvSnippet";
import { cn } from "@/lib/utils";
import { ScaffoldConfig, StepId } from "../../types";
import { ChevronDown, ClipboardCopy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  config: ScaffoldConfig;
  onEditStep: (step: StepId) => void;
}

export function GenerateStep({ config, onEditStep }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);

  const copyEnv = async () => {
    const text = buildEnvFromWizardConfig(config);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied .env snippet", {
        description: "Paste into your Expo template clone and run npx expo prebuild if IDs changed.",
      });
    } catch {
      toast.error("Could not copy", { description: "Select the preview text manually if needed." });
    }
  };

  const handleGenerateZip = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        let detail = `HTTP ${res.status}`;
        try {
          const j = (await res.json()) as { message?: string; error?: string };
          detail = j.message ?? j.error ?? detail;
        } catch {
          /* ignore */
        }
        throw new Error(detail);
      }

      const ct = res.headers.get("Content-Type") ?? "";
      if (!ct.includes("zip") && !ct.includes("octet-stream")) {
        throw new Error("Server did not return a zip (wrong Content-Type).");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.slug}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Download started", { description: `${config.slug}.zip` });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not download project zip.";
      toast.error("ZIP download failed", { description: msg });
    } finally {
      setIsGenerating(false);
    }
  };

  const summaryRows: { step: StepId; label: string; value: string }[] = [
    { step: "basics", label: "App name", value: config.appName },
    { step: "basics", label: "Bundle ID", value: config.bundleId },
    { step: "basics", label: "Slug", value: config.slug },
    { step: "basics", label: "Scheme", value: config.scheme },
    { step: "navigation", label: "Navigation (reference)", value: config.navigation },
    { step: "styling", label: "Dark mode → THEME_MODE", value: config.darkMode },
    { step: "styling", label: "Primary (reference)", value: config.primaryColor },
    { step: "state", label: "State", value: config.stateManagement },
    { step: "api", label: "API layer", value: config.apiLayer },
    { step: "auth", label: "Backend", value: config.backendProvider },
    {
      step: "auth",
      label: "API base (custom)",
      value:
        config.backendProvider === "custom" && config.customBackendUrl.trim()
          ? config.customBackendUrl.trim()
          : "—",
    },
    { step: "auth", label: "Auth", value: config.auth },
    {
      step: "extras",
      label: "Push",
      value: config.usePushNotifications ? "on (EXPO_PUBLIC_PUSH_SETUP=1)" : "off",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Generate</h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Download ZIP</strong> is the <strong className="text-foreground">full</strong>{" "}
          template tree plus a generated <code className="rounded bg-muted px-1 font-mono text-xs">.env</code> and{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">RN_INIT_README.txt</code> — your toggles live in{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">.env</code>, not as removed files. The server needs the
          template on disk or via URL — see <code className="rounded bg-muted px-1 font-mono text-xs">EXPO_TEMPLATE_PATH</code>{" "}
          / <code className="rounded bg-muted px-1 font-mono text-xs">EXPO_TEMPLATE_ARCHIVE_URL</code> in the Next app{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">.env.example</code>. In dev, a sibling{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">../../my-react-native-expo-template</code> is used
          automatically when present. <strong className="text-foreground">Copy .env</strong> still works without that.
        </p>
      </div>

      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Review &amp; edit
        </p>
        <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60 bg-white/60">
          {summaryRows.map((row) => (
            <div
              key={`${row.step}-${row.label}`}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:min-w-40 sm:text-[11px]">
                {row.label}
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                <Badge
                  variant="secondary"
                  className={cn(
                    "max-w-full justify-end truncate font-mono text-xs font-normal",
                    row.value.length > 24 && "max-w-[min(100%,18rem)]",
                  )}
                >
                  {row.value}
                </Badge>
                <button
                  type="button"
                  onClick={() => onEditStep(row.step)}
                  className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="opacity-60" />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={copyEnv} size="lg" className="rounded-full sm:flex-1">
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy .env snippet
        </Button>
        <Button
          onClick={handleGenerateZip}
          disabled={isGenerating}
          size="lg"
          variant="outline"
          className="rounded-full border-border/80 sm:flex-1"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Trying ZIP…
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download ZIP
            </>
          )}
        </Button>
      </div>

      <Collapsible open={jsonOpen} onOpenChange={setJsonOpen}>
        <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-3 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/35 hover:text-foreground">
          <span>View config JSON</span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", jsonOpen && "rotate-180")}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-muted/50 p-4 font-mono text-xs leading-relaxed">
            {JSON.stringify(config, null, 2)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
