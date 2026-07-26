import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/footwear/urban-canvas");
const OUT = path.resolve("public/projects/footwear");
const CANVAS_W = 1600;
const CANVAS_H = 1200;

const MAP = [
  ["01-lateral.png", "urban-canvas-01.webp"],
  ["02-perspectiva.png", "urban-canvas-02.webp"],
  ["03-top.png", "urban-canvas-03.webp"],
  ["04-detalhe-cadarco.png", "urban-canvas-04.webp"],
];

async function createStudioBackground() {
  const svg = `<svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow" cx="50%" cy="42%" r="55%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="55%" stop-color="#141414"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="accent" cx="50%" cy="75%" r="40%"><stop offset="0%" stop-color="#c8a96e" stop-opacity="0.12"/><stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#glow)"/><rect width="100%" height="100%" fill="url(#accent)"/><ellipse cx="50%" cy="88%" rx="38%" ry="6%" fill="#000" opacity="0.45"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function processFile(inputPath, outputPath, background, warmTint = false) {
  const meta = await sharp(inputPath).metadata();
  const maxDim = Math.max(meta.width ?? 0, meta.height ?? 0);
  const targetMax = maxDim > 1800 ? 1300 : 1100;
  let pipeline = sharp(inputPath)
    .rotate()
    .resize({ width: targetMax, height: targetMax, fit: "inside", withoutEnlargement: false })
    .sharpen({ sigma: 0.5 });

  if (warmTint) {
    pipeline = pipeline
      .recomb([
        [1.025, 0.012, 0],
        [0.008, 1.012, 0],
        [0, -0.008, 0.985],
      ])
      .modulate({ brightness: 0.985, saturation: 1.035 });
  }

  const product = await pipeline.toBuffer();
  const productMeta = await sharp(product).metadata();
  const pw = productMeta.width ?? targetMax;
  const ph = productMeta.height ?? targetMax;
  const left = Math.round((CANVAS_W - pw) / 2);
  const top = Math.round((CANVAS_H - ph) / 2 - CANVAS_H * 0.03);
  await sharp(background)
    .composite([{ input: product, left, top }])
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const background = await createStudioBackground();
  for (const [srcName, outName] of MAP) {
    const inputPath = path.join(SRC, srcName);
    if (!fs.existsSync(inputPath)) throw new Error("Missing: " + srcName);
    await processFile(inputPath, path.join(OUT, outName), background, srcName.includes("04-detalhe"));
    console.log("OK", outName);
  }
  await sharp(path.join(OUT, "urban-canvas-02.webp"))
    .resize(1920, 820, { fit: "cover", position: "centre" })
    .webp({ quality: 88 })
    .toFile(path.join(OUT, "cover.webp"));
  console.log("OK cover.webp");
}

main().catch((e) => { console.error(e); process.exit(1); });