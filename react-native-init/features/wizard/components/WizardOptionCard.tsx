"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

/** Soft tinted glows — deterministic per index (matches Navigation step). */
export const WIZARD_OPTION_GLOW: string[] = [
  "0 20px 44px -18px rgba(59, 130, 246, 0.28)",
  "0 20px 44px -18px rgba(168, 85, 247, 0.24)",
  "0 20px 44px -18px rgba(34, 197, 94, 0.22)",
  "0 20px 44px -18px rgba(249, 115, 22, 0.24)",
];

export type WizardOptionBadge = "in-repo" | "partial";

const BADGE_COPY: Record<WizardOptionBadge, string> = {
  "in-repo": "In repo",
  partial: "Partial",
};

interface Props {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  badge: WizardOptionBadge;
  glowIndex: number;
}

export function WizardOptionCard({
  selected,
  onSelect,
  title,
  description,
  badge,
  glowIndex,
}: Props) {
  const i = glowIndex % WIZARD_OPTION_GLOW.length;
  return (
    <div className="flex min-h-0 h-full min-w-0 flex-col">
      <Card
        role="radio"
        aria-checked={selected}
        tabIndex={0}
        style={{
          boxShadow: selected
            ? "0 10px 28px -18px rgba(15,23,42,0.08)"
            : WIZARD_OPTION_GLOW[i],
        }}
        className={cn(
          "flex h-full min-h-[11rem] flex-1 flex-col gap-0 overflow-visible border-0 py-0 shadow-none transition-[transform,box-shadow,ring-color,background-color] duration-200 hover:-translate-y-0.5 sm:min-h-[12rem]",
          selected
            ? "bg-sky-50/40 ring-1 ring-sky-500/45 ring-offset-2 ring-offset-zinc-50"
            : "bg-white/90 ring-1 ring-border/60 hover:ring-sky-400/25",
        )}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <div className="flex shrink-0 items-center gap-1.5">
              {selected ? (
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-sky-400/50 bg-white text-sky-700 shadow-sm"
                  aria-hidden
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
              ) : null}
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] font-medium uppercase tracking-wide",
                  badge === "in-repo" && "bg-emerald-500/10 text-emerald-800",
                  badge === "partial" && "bg-sky-500/10 text-sky-900",
                )}
              >
                {BADGE_COPY[badge]}
              </Badge>
            </div>
          </div>
          <p className="min-h-0 flex-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
