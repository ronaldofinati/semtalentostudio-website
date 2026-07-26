import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/footwear/generated");
const OUT = path.resolve("public/projects/footwear");
const CANVAS_W = 1600;
const CANVAS_H = 1200;

const MAP = [
  ["gen-urban-canvas-v2-01.png", "urban-canvas-01.webp"],
  ["gen-urban-canvas-v2-02.png", "urban-canvas-02.webp"],
  ["gen-urban-canvas-v2-03.png", "urban-canvas-03.webp"],
  ["gen-urban-canvas-v2-04.png", "urban-canvas-04.webp"],
  ["gen-urban-canvas-v2-05.png", "urban-canvas-05.webp"],
  ["gen-urban-canvas-v2-06.png", "urban-canvas-06.webp"],
  ["gen-urban-canvas-v2-07.png", "urban-canvas-07.webp"],
];

async function createStudioBackground() {
  const svg = `<svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow" cx="50%" cy="42%" r="55%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="55%" stop-color="#141414"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="accent" cx="50%" cy="75%" r="40%"><stop offset="0%" stop-color="#c8a96e" stop-opacity="0.12"/><stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#glow)"/><rect width="100%" height="100%" fill="url(#accent)"/><ellipse cx="50%" cy="88%" rx="38%" ry="6%" fill="#000" opacity="0.45"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function processFile(inputPath, outputPath, background) {
  const product = await sharp(inputPath)
    .resize({ width: CANVAS_W, height: CANVAS_H, fit: "contain", position: "centre", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .sharpen({ sigma: 0.7, m1: 0.5, m2: 0.35 })
    .modulate({ brightness: 1.03, saturation: 1.05 })
    .toBuffer();
  await sharp(background).composite([{ input: product, blend: "over" }]).webp({ quality: 90, effort: 6 }).toFile(outputPath);
}

async function main() {
  const background = await createStudioBackground();
  for (const [srcName, outName] of MAP) {
    const inputPath = path.join(SRC, srcName);
    if (!fs.existsSync(inputPath)) { console.warn("missing", srcName); continue; }
    await processFile(inputPath, path.join(OUT, outName), background);
    console.log("OK", outName);
  }
  await sharp(path.join(OUT, "urban-canvas-07.webp")).resize(1920, 820, { fit: "cover", position: "centre" }).webp({ quality: 88 }).toFile(path.join(OUT, "cover.webp"));
  console.log("OK cover.webp");
}

main().catch((e) => { console.error(e); process.exit(1); });