import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/footwear");
const OUT = path.resolve("public/projects/footwear");

const PRODUCTS = [
  {
    id: "urban-canvas",
    files: [
      "01 - All Star Converse 01.jpg",
      "01 - All Star Converse 02.jpg",
      "01 - All Star Converse 03.jpg",
      "01 - All Star Converse 04.jpg",
      "01 - All Star Converse 05.jpg",
      "01 - All Star Converse 06.jpg",
      "01 - All Star Converse 07.jpg",
    ],
  },
  {
    id: "flex-wave",
    files: [
      "02 - Sandalia Flex Wave 01.jpg",
      "02 - Sandalia Flex Wave 03.jpg",
      "02 - Sandalia Flex Wave 04.jpg",
    ],
  },
  {
    id: "flux-slip",
    files: [
      "03 - Tenis Air Flex 01.jpg",
      "03 - Tenis Air Flex 02.jpg",
      "03 - Tenis Air Flex 03.jpg",
    ],
  },
  {
    id: "vertex-stride",
    files: [
      "04 - Adidas 01.jpg",
      "04 - Adidas 02.jpg",
      "04 - Adidas 03.jpg",
      "04 - Adidas 04.jpg",
    ],
  },
  {
    id: "talento-rasteira",
    files: ["05 (1).jpg", "05 (2).jpg", "05 (3).jpg"],
  },
  {
    id: "last-studio",
    files: ["06 (1).jpg", "06 (2).jpg"],
  },
  {
    id: "baby-zoo",
    files: ["07 (1).jpg", "07 (2).jpg", "07 (3).jpg"],
  },
];

const CANVAS_W = 1600;
const CANVAS_H = 1200;

async function createStudioBackground() {
  const svg = `<svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow" cx="50%" cy="42%" r="55%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="55%" stop-color="#141414"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="accent" cx="50%" cy="75%" r="40%"><stop offset="0%" stop-color="#c8a96e" stop-opacity="0.12"/><stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#glow)"/><rect width="100%" height="100%" fill="url(#accent)"/><ellipse cx="50%" cy="88%" rx="38%" ry="6%" fill="#000" opacity="0.45"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function processImage(inputPath, outputPath, background) {
  const meta = await sharp(inputPath).metadata();
  const maxDim = Math.max(meta.width ?? 0, meta.height ?? 0);
  const targetMax = maxDim > 2000 ? 1300 : 1100;

  const product = await sharp(inputPath)
    .rotate()
    .resize({ width: targetMax, height: targetMax, fit: "inside", withoutEnlargement: false })
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.35 })
    .modulate({ brightness: 1.02, saturation: 1.04 })
    .toBuffer();

  const productMeta = await sharp(product).metadata();
  const pw = productMeta.width ?? targetMax;
  const ph = productMeta.height ?? targetMax;
  const left = Math.round((CANVAS_W - pw) / 2);
  const top = Math.round((CANVAS_H - ph) / 2 - CANVAS_H * 0.04);

  await sharp(background)
    .composite([{ input: product, left, top }])
    .webp({ quality: 88, effort: 6 })
    .toFile(outputPath);
}

async function processGenerated(inputPath, outputPath, background) {
  const product = await sharp(inputPath)
    .resize({ width: CANVAS_W, height: CANVAS_H, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.6 })
    .toBuffer();

  await sharp(background)
    .composite([{ input: product, blend: "over" }])
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const background = await createStudioBackground();

  for (const product of PRODUCTS) {
    for (let i = 0; i < product.files.length; i++) {
      const srcPath = path.join(SRC, product.files[i]);
      if (!fs.existsSync(srcPath)) { console.warn("Skip missing:", product.files[i]); continue; }
      const outName = `${product.id}-${String(i + 1).padStart(2, "0")}.webp`;
      await processImage(srcPath, path.join(OUT, outName), background);
      console.log("OK", outName);
    }
  }

  for (const [srcName, outName] of [["kynetic-pro-velocity.webp", "kynetic-pro-01.webp"], ["apex-forge-carbon.webp", "apex-forge-01.webp"]]) {
    const srcPath = path.join(SRC, srcName);
    if (!fs.existsSync(srcPath)) { console.warn("Skip generated:", srcName); continue; }
    await processGenerated(srcPath, path.join(OUT, outName), background);
    console.log("OK", outName);
  }

  const coverSrc = path.join(OUT, "kynetic-pro-01.webp");
  if (fs.existsSync(coverSrc)) {
    await sharp(coverSrc).resize(1920, 820, { fit: "cover", position: "centre" }).webp({ quality: 88 }).toFile(path.join(OUT, "cover.webp"));
    console.log("OK cover.webp");
  }
}

main().catch((err) => { console.error(err); process.exit(1); });