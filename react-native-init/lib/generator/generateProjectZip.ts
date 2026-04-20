import type { ScaffoldConfig } from "@/features/wizard/types";
import { buildEnvFromWizardConfig } from "@/lib/buildEnvSnippet";
import { buildZipReadme } from "@/lib/generator/zipReadme";
import fs from "fs/promises";
import JSZip from "jszip";
import path from "path";

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".expo",
  "dist",
  ".turbo",
  "coverage",
  "Pods",
  ".gradle",
]);

function skipDirectory(absPath: string, name: string): boolean {
  if (SKIP_DIR_NAMES.has(name)) return true;
  if (name === "build") {
    const n = absPath.replace(/\\/g, "/");
    return n.includes("/android/") || n.includes("/ios/");
  }
  return false;
}

async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function isExpoTemplateRoot(dir: string): Promise<boolean> {
  const pkgPath = path.join(dir, "package.json");
  try {
    const raw = await fs.readFile(pkgPath, "utf8");
    const j = JSON.parse(raw) as { dependencies?: Record<string, string> };
    return Boolean(j.dependencies?.expo);
  } catch {
    return false;
  }
}

type TemplateSource =
  | { kind: "path"; root: string }
  | { kind: "archive"; url: string };

/**
 * Accepts a real `.zip` URL, or a GitHub repo URL (`https://github.com/o/r` or `.../r.git`)
 * and turns it into `.../archive/refs/heads/<ref>.zip` (ref from `EXPO_TEMPLATE_GIT_REF` or `main`).
 */
export function normalizeArchiveUrl(input: string): string {
  const trimmed = input.trim();
  if (/\.zip(\?|$)/i.test(trimmed)) return trimmed;

  const m = trimmed.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/i,
  );
  if (m) {
    const owner = m[1];
    let repo = m[2];
    if (repo.toLowerCase().endsWith(".git")) {
      repo = repo.slice(0, -4);
    }
    const ref = process.env.EXPO_TEMPLATE_GIT_REF?.trim() || "main";
    return `https://github.com/${owner}/${repo}/archive/refs/heads/${ref}.zip`;
  }

  return trimmed;
}

async function resolveTemplateSource(): Promise<TemplateSource> {
  const envPath = process.env.EXPO_TEMPLATE_PATH?.trim();
  if (
    envPath &&
    (await pathExists(envPath)) &&
    (await isExpoTemplateRoot(envPath))
  ) {
    return { kind: "path", root: path.resolve(envPath) };
  }

  const archiveUrl = process.env.EXPO_TEMPLATE_ARCHIVE_URL?.trim();
  if (archiveUrl) {
    return { kind: "archive", url: normalizeArchiveUrl(archiveUrl) };
  }

  if (process.env.NODE_ENV === "development") {
    const sibling = path.resolve(
      process.cwd(),
      "..",
      "..",
      "my-react-native-expo-template",
    );
    if (
      (await pathExists(sibling)) &&
      (await isExpoTemplateRoot(sibling))
    ) {
      return { kind: "path", root: sibling };
    }
  }

  throw new Error(
    "ZIP_TEMPLATE_SOURCE: Set EXPO_TEMPLATE_PATH to your Expo template folder (must contain package.json with expo), or EXPO_TEMPLATE_ARCHIVE_URL to a .zip or a GitHub repo URL (https://github.com/owner/repo or .../.git — converted to archive zip; branch via EXPO_TEMPLATE_GIT_REF, default main). If the template lives in a subfolder of that repo (monorepo), set EXPO_TEMPLATE_SUBPATH (e.g. my-react-native-expo-template). In development, a sibling ../../my-react-native-expo-template from this app is tried automatically.",
  );
}

async function addDirectory(
  zip: JSZip,
  dirAbs: string,
  zipRel: string,
): Promise<void> {
  const entries = await fs.readdir(dirAbs, { withFileTypes: true });
  for (const ent of entries) {
    const childAbs = path.join(dirAbs, ent.name);
    const childRel = zipRel ? `${zipRel}/${ent.name}` : ent.name;
    const posixRel = childRel.split(path.sep).join("/");
    if (ent.isDirectory()) {
      if (skipDirectory(childAbs, ent.name)) continue;
      await addDirectory(zip, childAbs, childRel);
    } else {
      if (ent.name === ".DS_Store") continue;
      const buf = await fs.readFile(childAbs);
      zip.file(posixRel, buf);
    }
  }
}

async function zipFromFilesystem(root: string): Promise<JSZip> {
  const zip = new JSZip();
  await addDirectory(zip, root, "");
  return zip;
}

function normalizedTemplateSubpath(): string | null {
  const raw = process.env.EXPO_TEMPLATE_SUBPATH?.trim();
  if (!raw) return null;
  const s = raw.replace(/^\/+|\/+$/g, "").replace(/\\/g, "/");
  return s.length > 0 ? s : null;
}

/**
 * When the downloaded archive is a monorepo, keep only files under `subpath/`
 * and re-root the zip so `package.json` is at the top level.
 */
async function restrictZipToSubfolder(
  inner: JSZip,
  subpath: string,
): Promise<JSZip> {
  const prefix = `${subpath}/`;
  const out = new JSZip();
  const keys = Object.keys(inner.files).filter(
    (k) => !inner.files[k].dir && k.startsWith(prefix),
  );
  for (const key of keys) {
    const node = inner.files[key];
    if (!node) continue;
    const stripped = key.slice(prefix.length);
    if (!stripped || stripped.endsWith("/")) continue;
    const content = await node.async("nodebuffer");
    out.file(stripped, content);
  }
  if (Object.keys(out.files).length === 0) {
    throw new Error(
      `ZIP_ARCHIVE_SUBPATH_EMPTY: No files under "${prefix}" in the archive. Fix EXPO_TEMPLATE_SUBPATH (monorepo folder containing the Expo app).`,
    );
  }
  return out;
}

/**
 * Loads a remote zip (e.g. GitHub `.../archive/refs/heads/main.zip`), strips the
 * single top-level folder, and returns a flat project zip.
 */
async function zipFromRemoteArchive(url: string): Promise<JSZip> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`ZIP_ARCHIVE_FETCH: ${res.status} ${res.statusText}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const outer = await JSZip.loadAsync(buf);
  const fileKeys = Object.keys(outer.files).filter(
    (k) => !outer.files[k].dir && !k.startsWith("__MACOSX"),
  );
  if (fileKeys.length === 0) {
    throw new Error("ZIP_ARCHIVE_EMPTY");
  }
  const rootFolder = fileKeys[0].split("/")[0];
  if (!rootFolder) {
    throw new Error("ZIP_ARCHIVE_BAD_LAYOUT");
  }
  const prefix = `${rootFolder}/`;
  const inner = new JSZip();
  for (const key of fileKeys) {
    const node = outer.files[key];
    if (!node || node.dir) continue;
    if (!key.startsWith(prefix)) continue;
    const stripped = key.slice(prefix.length);
    if (!stripped || stripped.endsWith("/")) continue;
    const content = await node.async("nodebuffer");
    inner.file(stripped, content);
  }
  const sub = normalizedTemplateSubpath();
  if (sub) {
    return restrictZipToSubfolder(inner, sub);
  }
  return inner;
}

function safeZipFilename(slug: string): string {
  const s = slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 60);
  return s.length > 0 ? s : "app";
}

export { safeZipFilename };

export async function generateProjectZip(
  config: ScaffoldConfig,
): Promise<Buffer> {
  const source = await resolveTemplateSource();
  const zip =
    source.kind === "path"
      ? await zipFromFilesystem(source.root)
      : await zipFromRemoteArchive(source.url);

  zip.file(".env", buildEnvFromWizardConfig(config));
  zip.file("RN_INIT_README.txt", buildZipReadme(config));

  return zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
