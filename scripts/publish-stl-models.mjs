/**
 * Publishes curated CC0 STL models from Assets into public/models/3d.
 * Run: node scripts/publish-stl-models.mjs
 *
 * Source: ASSETS_ROOT/projects/stl (see docs/ASSETS.md). Catalog from indice.csv.
 * Skips the full github_IRLToolkit_3d clone and any .git directories.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getAssetsRoot, getProjectRoot } from "./lib/assets-root.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = getProjectRoot();
const SRC_ROOT = path.join(getAssetsRoot(), "projects", "stl");
const INDEX_CSV = path.join(SRC_ROOT, "indice.csv");
const OUT_ROOT = path.join(ROOT, "public", "models", "3d");
const CATALOG_JSON = path.join(OUT_ROOT, "catalog.json");
const CATALOG_TS = path.join(ROOT, "src", "data", "stl-catalog.ts");
const README_TXT = path.join(OUT_ROOT, "README.txt");

const SKIP_DIR_NAMES = new Set(["github_IRLToolkit_3d", ".git"]);
/** Authors / folders excluded from the public catalog (policy). */
const SKIP_AUTHORS = new Set(["guyonacouch"]);
const SKIP_MODEL_IDS = new Set([
  "printables_461132_bic-lighter-case-tree-of-life",
  "printables_461143_bic-lighter-case-pot-leaf",
  "printables_467291_bic-lighter-case-rick",
  "printables_628313_bic-lighter-case-spider-web",
  "github_IRLToolkit_3d_as300-coldshoe",
]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
/** Paid demo items — set to 0 while the library is free; raise later for commercial SKUs. */
const PAID_COUNT = 0;
const PAID_PRICE = 5;

function writeUtf8NoBom(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.from(content, "utf8"));
}

function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur);
  return fields;
}

function readIndice() {
  const raw = fs.readFileSync(INDEX_CSV, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error("indice.csv is empty");
  const header = parseCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const pastaIdx = header.indexOf("pasta");
  const nomeIdx = header.indexOf("nome");
  const urlIdx = header.indexOf("url");
  if (pastaIdx < 0) throw new Error("indice.csv missing pasta column");

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const id = (cols[pastaIdx] || "").trim();
    if (!id) continue;
    rows.push({
      id,
      nome: (nomeIdx >= 0 ? cols[nomeIdx] : "")?.trim() || "",
      url: (urlIdx >= 0 ? cols[urlIdx] : "")?.trim() || "",
    });
  }
  return rows;
}

function humanizeId(id) {
  const base = id
    .replace(/^github_[^_]+_[^_]+_/, "")
    .replace(/^printables_\d+_/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!base) return id;
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}

function readMetadata(dir) {
  const metaPath = path.join(dir, "metadata.json");
  if (!fs.existsSync(metaPath)) return {};
  try {
    const raw = fs.readFileSync(metaPath);
    // UTF-16 LE with BOM
    if (raw.length >= 2 && raw[0] === 0xff && raw[1] === 0xfe) {
      return JSON.parse(raw.toString("utf16le").replace(/^\uFEFF/, ""));
    }
    // UTF-16 BE with BOM
    if (raw.length >= 2 && raw[0] === 0xfe && raw[1] === 0xff) {
      const swapped = Buffer.alloc(raw.length - 2);
      for (let i = 2; i + 1 < raw.length; i += 2) {
        swapped[i - 2] = raw[i + 1];
        swapped[i - 1] = raw[i];
      }
      return JSON.parse(swapped.toString("utf16le"));
    }
    // UTF-8 (strip BOM)
    return JSON.parse(raw.toString("utf8").replace(/^\uFEFF/, ""));
  } catch (err) {
    console.warn(`warn: could not parse metadata.json in ${dir}: ${err.message}`);
    return {};
  }
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function shouldPublishFile(relPosix, baseNameLower) {
  const ext = path.extname(baseNameLower);
  if (ext === ".stl") return true;
  if (baseNameLower === "license" || baseNameLower === "license.txt") return true;
  if (baseNameLower === "metadata.json") return true;
  if (IMAGE_EXT.has(ext)) return true;
  return false;
}

function copyWithRobocopy(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  // Mirror only needed file types via multiple robocopy passes for efficiency.
  const patterns = ["*.stl", "LICENSE", "LICENSE.txt", "metadata.json", "*.jpg", "*.jpeg", "*.png", "*.webp", "*.gif", "*.avif"];
  let ok = true;
  for (const pattern of patterns) {
    const r = spawnSync(
      "robocopy",
      [
        srcDir,
        destDir,
        pattern,
        "/E",
        "/NFL",
        "/NDL",
        "/NJH",
        "/NJS",
        "/NC",
        "/NS",
        "/NP",
        "/XD",
        ".git",
        "github_IRLToolkit_3d",
      ],
      { encoding: "utf8", windowsHide: true },
    );
    // robocopy: 0–7 = success-ish; >= 8 = failure
    if (typeof r.status === "number" && r.status >= 8) {
      ok = false;
      console.warn(`robocopy failed (${r.status}) for ${pattern}: ${r.stderr || r.stdout || ""}`);
    }
  }
  return ok;
}

function fallbackCopy(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const files = walkFiles(srcDir);
  for (const full of files) {
    const rel = path.relative(srcDir, full);
    const base = path.basename(full).toLowerCase();
    const relPosix = rel.split(path.sep).join("/");
    if (!shouldPublishFile(relPosix, base)) continue;
    const dest = path.join(destDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(full, dest);
  }
}

function collectPublished(destDir, id) {
  const files = walkFiles(destDir);
  const stlFiles = [];
  const images = [];
  for (const full of files) {
    const rel = path.relative(destDir, full).split(path.sep).join("/");
    const ext = path.extname(full).toLowerCase();
    const publicPath = `/models/3d/${id}/${rel}`;
    if (ext === ".stl") stlFiles.push(publicPath);
    else if (IMAGE_EXT.has(ext)) images.push(publicPath);
  }
  stlFiles.sort((a, b) => a.localeCompare(b, "en"));
  images.sort((a, b) => a.localeCompare(b, "en"));
  const preview =
    images.find((p) => /preview/i.test(path.basename(p))) ||
    images[0] ||
    null;
  return { stlFiles, previewImage: preview };
}

function escTs(s) {
  return JSON.stringify(s);
}

function buildTs(catalog) {
  const lines = [];
  lines.push(`export type StlModel = {`);
  lines.push(`  id: string;`);
  lines.push(`  title: string;`);
  lines.push(`  author: string;`);
  lines.push(`  summary: string;`);
  lines.push(`  sourceUrl: string;`);
  lines.push(`  license: "CC0-1.0";`);
  lines.push(`  stlFiles: string[];`);
  lines.push(`  previewImage: string | null;`);
  lines.push(`  priceUsd: number;`);
  lines.push(`  stlCount: number;`);
  lines.push(`};`);
  lines.push(``);
  lines.push(`export const stlCatalog: StlModel[] = [`);
  for (const m of catalog) {
    lines.push(`  {`);
    lines.push(`    id: ${escTs(m.id)},`);
    lines.push(`    title: ${escTs(m.title)},`);
    lines.push(`    author: ${escTs(m.author)},`);
    lines.push(`    summary: ${escTs(m.summary)},`);
    lines.push(`    sourceUrl: ${escTs(m.sourceUrl)},`);
    lines.push(`    license: "CC0-1.0",`);
    lines.push(`    stlFiles: ${escTs(m.stlFiles)},`);
    lines.push(`    previewImage: ${m.previewImage === null ? "null" : escTs(m.previewImage)},`);
    lines.push(`    priceUsd: ${m.priceUsd},`);
    lines.push(`    stlCount: ${m.stlCount},`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(``);
  lines.push(`export function getStlModel(id: string): StlModel | undefined {`);
  lines.push(`  return stlCatalog.find((m) => m.id === id);`);
  lines.push(`}`);
  lines.push(``);
  return lines.join("\n");
}

function assertNoNullBytes(filePath) {
  const buf = fs.readFileSync(filePath);
  for (let i = 0; i < buf.length; i++) {
    if (buf[i] === 0) {
      throw new Error(`null byte found in ${filePath} at offset ${i}`);
    }
  }
}

const CATALOG_ONLY = process.argv.includes("--catalog-only");

function main() {
  if (!fs.existsSync(INDEX_CSV)) {
    throw new Error(`Missing indice.csv at ${INDEX_CSV}`);
  }

  const rows = readIndice();
  console.log(`indice entries: ${rows.length}`);

  fs.mkdirSync(OUT_ROOT, { recursive: true });

  const catalog = [];
  let copyMode = null;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.id === "github_IRLToolkit_3d" || SKIP_DIR_NAMES.has(row.id) || SKIP_MODEL_IDS.has(row.id)) {
      console.warn(`skip (not curated): ${row.id}`);
      continue;
    }

    const srcDir = path.join(SRC_ROOT, row.id);
    if (!fs.existsSync(srcDir)) {
      console.warn(`missing folder: ${row.id}`);
      continue;
    }

    const metaEarly = readMetadata(srcDir);
    const authorEarly =
      (typeof metaEarly.author === "string" && metaEarly.author.trim().toLowerCase()) || "";
    if (authorEarly && SKIP_AUTHORS.has(authorEarly)) {
      console.warn(`skip (author policy): ${row.id} (${metaEarly.author})`);
      continue;
    }

    const destDir = path.join(OUT_ROOT, row.id);
    if (!CATALOG_ONLY) {
      if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true });
      }

      if (process.platform === "win32") {
        const ok = copyWithRobocopy(srcDir, destDir);
        if (!ok) fallbackCopy(srcDir, destDir);
        copyMode = copyMode || (ok ? "robocopy" : "fallback");
      } else {
        fallbackCopy(srcDir, destDir);
        copyMode = "fallback";
      }
    } else {
      copyMode = "catalog-only";
      if (!fs.existsSync(destDir)) {
        console.warn(`missing published folder: ${row.id}`);
        continue;
      }
    }

    const meta = readMetadata(srcDir);
    // Ensure metadata.json exists in dest (robocopy should have copied it)
    const destMeta = path.join(destDir, "metadata.json");
    if (!fs.existsSync(destMeta) && fs.existsSync(path.join(srcDir, "metadata.json"))) {
      fs.copyFileSync(path.join(srcDir, "metadata.json"), destMeta);
    }

    const { stlFiles, previewImage } = collectPublished(destDir, row.id);
    if (!previewImage) {
      console.warn(`skip (no preview image): ${row.id}`);
      if (!CATALOG_ONLY && fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true });
      }
      continue;
    }
    if (stlFiles.length === 0) {
      console.warn(`skip (no STL files): ${row.id}`);
      if (!CATALOG_ONLY && fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true, force: true });
      }
      continue;
    }

    const title =
      (typeof meta.name === "string" && meta.name.trim()) ||
      row.nome ||
      humanizeId(row.id);
    const author =
      (typeof meta.author === "string" && meta.author.trim()) ||
      (typeof meta.source === "string" && meta.source.trim()) ||
      "Unknown";
    const summary =
      (typeof meta.summary === "string" && meta.summary.trim()) || "";
    const sourceUrl =
      (typeof meta.source_url === "string" && meta.source_url.trim()) ||
      row.url ||
      "";

    const priceUsd = i < PAID_COUNT ? PAID_PRICE : 0;

    catalog.push({
      id: row.id,
      title,
      author,
      summary,
      sourceUrl,
      license: "CC0-1.0",
      stlFiles,
      previewImage,
      priceUsd,
      stlCount: stlFiles.length,
    });

    if ((i + 1) % 20 === 0 || i === rows.length - 1) {
      console.log(`published ${i + 1}/${rows.length}: ${row.id} (${stlFiles.length} stl)`);
    }
  }

  writeUtf8NoBom(CATALOG_JSON, `${JSON.stringify(catalog, null, 2)}\n`);
  writeUtf8NoBom(CATALOG_TS, buildTs(catalog));
  writeUtf8NoBom(
    README_TXT,
    [
      "Published STL models catalog (canonical location).",
      "",
      "This folder is what the site serves at /models/3d/.",
      "After verifying downloads work on the site, you may delete:",
      "  ASSETS_ROOT\\projects\\stl (arquivo-fonte; ver docs/ASSETS.md)",
      "Keep public\\models\\3d (this directory) — do not delete it.",
      "",
      `Models: ${catalog.length}`,
      `Generated by: scripts/publish-stl-models.mjs`,
      "",
    ].join("\n"),
  );

  assertNoNullBytes(CATALOG_JSON);
  assertNoNullBytes(CATALOG_TS);

  const paid = catalog.filter((m) => m.priceUsd > 0).map((m) => m.id);
  const free = catalog.filter((m) => m.priceUsd === 0).length;
  const stlTotal = catalog.reduce((n, m) => n + m.stlCount, 0);

  console.log("---");
  console.log(`copy mode: ${copyMode}`);
  console.log(`catalog length: ${catalog.length}`);
  console.log(`stl files: ${stlTotal}`);
  console.log(`paid (${paid.length}): ${paid.join(", ")}`);
  console.log(`free: ${free}`);
  console.log(`wrote: ${path.relative(ROOT, CATALOG_JSON)}`);
  console.log(`wrote: ${path.relative(ROOT, CATALOG_TS)}`);
  console.log(`out: ${path.relative(ROOT, OUT_ROOT)}`);

  if (catalog.length !== 116) {
    console.warn(`WARNING: expected 116 models, got ${catalog.length}`);
    process.exitCode = 1;
  }
}

main();
