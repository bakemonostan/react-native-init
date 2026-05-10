import type JSZip from "jszip";

/**
 * Paths that are useful inside the monorepo template but clutter or confuse
 * a generated handoff ZIP (internal wizard notes, gap lists, dev-only changelogs).
 */
const MAINTAINER_ONLY_PATHS = [
  "docs/WIZARD_AND_TEMPLATE.md",
  "docs/TEMPLATE_GAPS.md",
  "components/ui/FIXES.md",
] as const;

/** Remove maintainer-only files from the in-memory ZIP before `generateAsync`. */
export function stripMaintainerArtifactsFromZip(zip: JSZip): void {
  for (const p of MAINTAINER_ONLY_PATHS) {
    if (zip.file(p)) zip.remove(p);
  }
}
