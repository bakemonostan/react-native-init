"use client";

import { cn } from "@/lib/utils";

interface Props {
  title: string;
  content: string;
  className?: string;
}

export function EnvSnippetPreview({ title, content, className }: Props) {
  return (
    <div
      className={cn(
        "space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3 sm:p-4",
        className,
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-all font-mono text-[11px] leading-relaxed text-foreground">
        {content}
      </pre>
    </div>
  );
}
