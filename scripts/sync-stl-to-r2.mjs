/**
 * Sync local public/models/3d → Cloudflare R2 (S3-compatible).
 *
 * Required env (put in .env.local or export before running — never commit secrets):
 *   R2_ACCOUNT_ID
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET          (default: semtalento-models)
 *   R2_PREFIX          (default: models/3d)
 *
 * Usage:
 *   node scripts/sync-stl-to-r2.mjs
 *   node scripts/sync-stl-to-r2.mjs --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { createReadStream } from "node:fs";
import { S3Client, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

function loadEnvLocal() {
  const envPath = path.resolve(".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const dryRun = process.argv.includes("--dry-run");
const accountId = (process.env.R2_ACCOUNT_ID || "").trim();
const accessKeyId = (process.env.R2_ACCESS_KEY_ID || "").trim();
const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || "").trim();
const bucket = (process.env.R2_BUCKET || "semtalento-models").trim();
const prefix = (process.env.R2_PREFIX || "models/3d").replace(/^\/+|\/+$/g, "");
const localRoot = path.resolve("public/models/3d");

const CONTENT_TYPES = {
  ".stl": "model/stl",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
};

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[ext] || "application/octet-stream";
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error(
    "ERRO: Defina R2_ACCOUNT_ID, R2_ACCESS_KEY_ID e R2_SECRET_ACCESS_KEY (ex.: no .env.local).",
  );
  process.exit(1);
}

if (!/^[a-f0-9]{32}$/i.test(accountId)) {
  console.error(
    "ERRO: R2_ACCOUNT_ID deve ter exatamente 32 caracteres hex (a-f, 0-9).",
    `Agora tem ${accountId.length}. Confira o pedaco do meio de https://ACCOUNT_ID.r2.cloudflarestorage.com`,
  );
  process.exit(1);
}

if (!fs.existsSync(localRoot)) {
  console.error("ERRO: Pasta local nao encontrada:", localRoot);
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
  // AWS SDK v3 defaults break some R2 handshakes / checksums
  forcePathStyle: false,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

const files = walkFiles(localRoot);
console.log(
  `Sync ${files.length} arquivos → s3://${bucket}/${prefix}/  ${dryRun ? "(dry-run)" : ""}`,
);

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (let i = 0; i < files.length; i++) {
  const filePath = files[i];
  const relative = toPosix(path.relative(localRoot, filePath));
  const key = `${prefix}/${relative}`;
  const stat = fs.statSync(filePath);
  const label = `[${i + 1}/${files.length}] ${key}`;

  try {
    let exists = false;
    try {
      const head = await client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key }),
      );
      if (head.ContentLength === stat.size) exists = true;
    } catch {
      exists = false;
    }

    if (exists) {
      skipped += 1;
      if ((i + 1) % 50 === 0 || i === files.length - 1) {
        console.log(`${label} — skip (mesmo tamanho)`);
      }
      continue;
    }

    if (dryRun) {
      console.log(`${label} — would upload (${stat.size} bytes)`);
      uploaded += 1;
      continue;
    }

    const contentType = contentTypeFor(filePath);
    if (stat.size > 5 * 1024 * 1024) {
      const upload = new Upload({
        client,
        params: {
          Bucket: bucket,
          Key: key,
          Body: createReadStream(filePath),
          ContentType: contentType,
          CacheControl: "public, max-age=31536000, immutable",
        },
      });
      await upload.done();
    } else {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: fs.readFileSync(filePath),
          ContentType: contentType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
    }

    uploaded += 1;
    console.log(`${label} — ok (${stat.size} bytes)`);
  } catch (err) {
    failed += 1;
    console.error(`${label} — FALHOU:`, err.message || err);
  }
}

console.log(
  `\nConcluido. uploaded=${uploaded} skipped=${skipped} failed=${failed}`,
);
if (failed > 0) process.exit(1);
