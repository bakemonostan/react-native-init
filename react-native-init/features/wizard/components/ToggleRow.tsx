"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  description: string;
  checked: boolean;
  onToggle: (val: boolean) => void;
}

export function ToggleRow({ label, description, checked, onToggle }: Props) {
  const id = label.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-zinc-50/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0 flex-1 space-y-1">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium leading-snug text-foreground">
          {label}
        </Label>
        <p className="text-xs font-normal leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex shrink-0 justify-end sm:pt-0">
        <Switch id={id} checked={checked} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}
