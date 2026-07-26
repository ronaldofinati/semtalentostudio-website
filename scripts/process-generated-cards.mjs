import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/footwear/generated");
const OUT = path.resolve("public/projects/footwear");
const CANVAS_W = 1600;
const CANVAS_H = 1200;

const MAP = [
  ["gen-urban-canvas-01.png", "urban-canvas-01.webp"],
  ["gen-urban-canvas-02.png", "urban-canvas-02.webp"],
  ["gen-urban-canvas-03.png", "urban-canvas-03.webp"],
  ["gen-urban-canvas-04.png", "urban-canvas-04.webp"],
  ["gen-urban-canvas-05.png", "urban-canvas-05.webp"],
  ["gen-urban-canvas-06.png", "urban-canvas-06.webp"],
  ["gen-urban-canvas-07.png", "urban-canvas-07.webp"],
  ["gen-kynetic-pro-01.png", "kynetic-pro-01.webp"],
  ["gen-kynetic-pro-02.png", "kynetic-pro-02.webp"],
  ["gen-kynetic-pro-03.png", "kynetic-pro-03.webp"],
  ["gen-kynetic-pro-04.png", "kynetic-pro-04.webp"],
  ["gen-apex-forge-01.png", "apex-forge-01.webp"],
  ["gen-apex-forge-02.png", "apex-forge-02.webp"],
  ["gen-apex-forge-03.png", "apex-forge-03.webp"],
  ["gen-apex-forge-04.png", "apex-forge-04.webp"],
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

  await sharp(background)
    .composite([{ input: product, blend: "over" }])
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const background = await createStudioBackground();
  for (const [srcName, outName] of MAP) {
    const inputPath = path.join(SRC, srcName);
    if (!fs.existsSync(inputPath)) { console.warn("missing", srcName); continue; }
    await processFile(inputPath, path.join(OUT, outName), background);
    console.log("OK", outName);
  }
  await sharp(path.join(OUT, "urban-canvas-07.webp"))
    .resize(1920, 820, { fit: "cover", position: "centre" })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, "cover.webp"));
  console.log("OK cover.webp");
}

main().catch((e) => { console.error(e); process.exit(1); });