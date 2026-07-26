import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/inflaveis");
const OUT = path.resolve("public/projects/inflatable");
const CANVAS_W = 1600;
const CANVAS_H = 1200;

function resolveFolder(prefix) {
  const match = fs
    .readdirSync(SRC, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .find((name) => name.startsWith(prefix));
  if (!match) throw new Error("Folder not found for prefix: " + prefix);
  return path.join(SRC, match);
}

function listImages(folderPath) {
  return fs
    .readdirSync(folderPath)
    .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
}

async function createStudioBackground() {
  const svg = `<svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow" cx="50%" cy="42%" r="55%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="55%" stop-color="#141414"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="accent" cx="50%" cy="75%" r="40%"><stop offset="0%" stop-color="#c8a96e" stop-opacity="0.12"/><stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#glow)"/><rect width="100%" height="100%" fill="url(#accent)"/><ellipse cx="50%" cy="88%" rx="38%" ry="6%" fill="#000" opacity="0.45"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function processFile(inputPath, outputPath, background) {
  const meta = await sharp(inputPath).metadata();
  const maxDim = Math.max(meta.width ?? 0, meta.height ?? 0);
  const targetMax = maxDim > 1800 ? 1300 : 1100;
  const product = await sharp(inputPath)
    .rotate()
    .resize({ width: targetMax, height: targetMax, fit: "inside", withoutEnlargement: false })
    .sharpen({ sigma: 0.45 })
    .modulate({ brightness: 1.02, saturation: 1.05 })
    .toBuffer();
  const productMeta = await sharp(product).metadata();
  const pw = productMeta.width ?? targetMax;
  const ph = productMeta.height ?? targetMax;
  await sharp(background)
    .composite([{
      input: product,
      left: Math.round((CANVAS_W - pw) / 2),
      top: Math.round((CANVAS_H - ph) / 2 - CANVAS_H * 0.03),
    }])
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

const folder = resolveFolder("06");
const files = listImages(folder);
if (files.length === 0) throw new Error("No images in 06 Curso");

fs.mkdirSync(OUT, { recursive: true });
const background = await createStudioBackground();

let i = 1;
for (const file of files) {
  const outName = `curso-${String(i).padStart(2, "0")}.webp`;
  await processFile(path.join(folder, file), path.join(OUT, outName), background);
  console.log("OK", file, "->", outName);
  i += 1;
}
console.log("Done", files.length, "images");