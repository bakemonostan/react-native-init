#!/usr/bin/env node
/**
 * Scans assets/icons/my-icons/*.svg and writes icons/svgRegistry.tsx (typed SvgIcon map).
 * Run: npm run icons:gen
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ICON_DIR = path.join(ROOT, "assets/icons/my-icons");
const OUT = path.join(ROOT, "icons/svgRegistry.tsx");

/** Valid JS identifier for import binding */
function toImportName(base) {
  const parts = base.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const pascal = parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join("");
  const stem = pascal || "Icon";
  return `Svg${stem}`;
}

async function main() {
  let files = [];
  try {
    files = await fs.readdir(ICON_DIR);
  } catch {
    console.error(`SVG icons folder missing: ${ICON_DIR}`);
    process.exit(1);
  }

  const svgFiles = files
    .filter((f) => f.toLowerCase().endsWith(".svg"))
    .sort();

  if (svgFiles.length === 0) {
    console.error(
      `No .svg files in ${ICON_DIR}. Add at least one SVG, then run again.`,
    );
    process.exit(1);
  }

  const imports = [];
  const entries = [];
  const usedBindings = new Set();

  for (const file of svgFiles) {
    const base = file.replace(/\.svg$/i, "");
    const key = base;
    let binding = toImportName(base);
    while (usedBindings.has(binding)) {
      binding = `${binding}X`;
    }
    usedBindings.add(binding);

    const importPath = path
      .relative(path.dirname(OUT), path.join(ICON_DIR, file))
      .split(path.sep)
      .join("/");

    imports.push(`import ${binding} from "${importPath}";`);

    const propKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
      ? key
      : JSON.stringify(key);
    entries.push(`  ${propKey}: ${binding},`);
  }

  const body = `/**
 * AUTO-GENERATED — do not edit by hand.
 * Run: npm run icons:gen
 *
 * Source: assets/icons/my-icons/*.svg
 */

import type { SvgProps } from "react-native-svg";

${imports.join("\n")}

export const svgIcons = {
${entries.join("\n")}
} as const;

export type SvgIconName = keyof typeof svgIcons;

export type SvgIconProps = {
  name: SvgIconName;
  /** Width and height in logical pixels */
  size?: number;
  /** Passed to the SVG root — use \`currentColor\` in SVG artwork for tinting */
  color?: string;
} & Omit<SvgProps, "width" | "height">;

export function SvgIcon({
  name,
  size = 24,
  color,
  ...rest
}: SvgIconProps) {
  const Cmp = svgIcons[name];
  return (
    <Cmp width={size} height={size} color={color} {...rest} />
  );
}
`;

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, body, "utf8");
  console.log(`Wrote ${OUT} (${svgFiles.length} icon(s)).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
