import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/footwear/urban-canvas");
const OUT = path.resolve("public/projects/footwear");
const inputPath = path.join(SRC, "04-detalhe-cadarco.png");
const outputPath = path.join(OUT, "urban-canvas-04.webp");
const CANVAS_W = 1600;
const CANVAS_H = 1200;

async function createStudioBackground() {
  const svg = `<svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow" cx="50%" cy="42%" r="55%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="55%" stop-color="#141414"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="accent" cx="50%" cy="75%" r="40%"><stop offset="0%" stop-color="#c8a96e" stop-opacity="0.12"/><stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#glow)"/><rect width="100%" height="100%" fill="url(#accent)"/><ellipse cx="50%" cy="88%" rx="38%" ry="6%" fill="#000" opacity="0.45"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

const meta = await sharp(inputPath).metadata();
const targetMax = Math.max(meta.width ?? 0, meta.height ?? 0) > 1800 ? 1300 : 1100;
const background = await createStudioBackground();

const product = await sharp(inputPath)
  .rotate()
  .resize({ width: targetMax, height: targetMax, fit: "inside", withoutEnlargement: false })
  .sharpen({ sigma: 0.5 })
  .recomb([
    [1.025, 0.012, 0],
    [0.008, 1.012, 0],
    [0, -0.008, 0.985],
  ])
  .modulate({ brightness: 0.985, saturation: 1.035 })
  .toBuffer();

const productMeta = await sharp(product).metadata();
const pw = productMeta.width ?? targetMax;
const ph = productMeta.height ?? targetMax;
const left = Math.round((CANVAS_W - pw) / 2);
const top = Math.round((CANVAS_H - ph) / 2 - CANVAS_H * 0.03);

await sharp(background)
  .composite([{ input: product, left, top }])
  .webp({ quality: 90, effort: 6 })
  .toFile(outputPath);

console.log("OK urban-canvas-04.webp warm tint applied");