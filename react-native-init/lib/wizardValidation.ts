import type { ScaffoldConfig } from "@/features/wizard/types";
import { z } from "zod";

const basicsSchema = z.object({
  appName: z
    .string()
    .trim()
    .min(2, "Use at least 2 characters")
    .max(60, "Keep the name under 60 characters"),
  bundleId: z
    .string()
    .trim()
    .regex(
      /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/,
      "Use lowercase reverse-DNS, e.g. com.company.app",
    ),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Lowercase letters, numbers, and single hyphens only",
    ),
  scheme: z
    .string()
    .trim()
    .regex(
      /^[a-z][a-z0-9-]*$/,
      "Lowercase scheme: start with a letter, then letters, numbers, or hyphens",
    ),
});

export type BasicsField = keyof z.infer<typeof basicsSchema>;

export const BASICS_FIELDS: BasicsField[] = [
  "appName",
  "bundleId",
  "slug",
  "scheme",
];

export function validateBasics(
  config: Pick<ScaffoldConfig, "appName" | "bundleId" | "slug" | "scheme">,
):
  | { ok: true }
  | { ok: false; errors: Partial<Record<BasicsField, string>> } {
  const parsed = basicsSchema.safeParse({
    appName: config.appName,
    bundleId: config.bundleId,
    slug: config.slug,
    scheme: config.scheme,
  });
  if (parsed.success) return { ok: true };

  const errors: Partial<Record<BasicsField, string>> = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as BasicsField;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { ok: false, errors };
}
