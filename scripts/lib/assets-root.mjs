import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Resolve the Assets archive root.
 * Priority: ASSETS_ROOT env → .assets-root file → ./Assets → ../Arquivo Assets
 */
export function getProjectRoot() {
  return ROOT;
}

export function getAssetsRoot() {
  if (process.env.ASSETS_ROOT && process.env.ASSETS_ROOT.trim()) {
    return path.resolve(process.env.ASSETS_ROOT.trim());
  }

  const marker = path.join(ROOT, ".assets-root");
  if (fs.existsSync(marker)) {
    const raw = fs.readFileSync(marker, "utf8").replace(/^\uFEFF/, "");
    const line = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("#"));
    if (line) return path.resolve(line);
  }

  const local = path.join(ROOT, "Assets");
  if (fs.existsSync(local)) return local;

  const archive = path.join(ROOT, "..", "Arquivo Assets");
  if (fs.existsSync(archive)) return archive;

  return local;
}

export function assetsPath(...parts) {
  return path.join(getAssetsRoot(), ...parts);
}