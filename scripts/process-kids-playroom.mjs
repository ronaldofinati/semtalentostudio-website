import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/footwear/kids-playroom");
const OUT = path.resolve("public/projects/footwear");
const W = 1920;
const H = 960;
const STUDIO_W = 1600;
const STUDIO_H = 1200;

const MAP = [
  ["00-hero.png", "kids-playroom-00.webp", "hero"],
  ["01-tenis-menino.png", "kids-playroom-01.webp", "studio"],
  ["02-papete-menino.png", "kids-playroom-02.webp", "studio"],
  ["03-sapatilha-menina.png", "kids-playroom-03.webp", "studio"],
  ["04-sandalia-menina.png", "kids-playroom-04.webp", "studio"],
];

async function studioBg() {
  const svg = `<svg width="${STUDIO_W}" height="${STUDIO_H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="50%" cy="42%" r="55%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="55%" stop-color="#141414"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="a" cx="50%" cy="75%" r="40%"><stop offset="0%" stop-color="#c8a96e" stop-opacity="0.12"/><stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#a)"/><ellipse cx="50%" cy="88%" rx="38%" ry="6%" fill="#000" opacity="0.45"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function processHero(inputPath, outputPath) {
  await sharp(inputPath)
    .resize({ width: W, height: H, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.5 })
    .modulate({ brightness: 1.02, saturation: 1.04 })
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

async function processStudio(inputPath, outputPath, background) {
  const meta = await sharp(inputPath).metadata();
  const target = Math.max(meta.width ?? 0, meta.height ?? 0) > 1800 ? 1300 : 1100;
  const product = await sharp(inputPath)
    .resize({ width: target, height: target, fit: "inside", withoutEnlargement: false })
    .sharpen({ sigma: 0.5 })
    .modulate({ brightness: 1.03, saturation: 1.05 })
    .toBuffer();
  const pm = await sharp(product).metadata();
  const pw = pm.width ?? target;
  const ph = pm.height ?? target;
  await sharp(background)
    .composite([{ input: product, left: Math.round((STUDIO_W - pw) / 2), top: Math.round((STUDIO_H - ph) / 2 - STUDIO_H * 0.03) }])
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const bedroomBg = path.join(path.dirname(SRC), "kids-playroom", "00-bedroom-bg.png");
  if (fs.existsSync(bedroomBg)) {
    const { execSync } = await import("node:child_process");
    execSync("node scripts/compose-kids-hero.mjs", { stdio: "inherit" });
  }

  const background = await studioBg();
  for (const [srcName, outName, mode] of MAP) {
    const inputPath = path.join(SRC, srcName);
    if (!fs.existsSync(inputPath)) throw new Error("Missing: " + srcName);
    const outputPath = path.join(OUT, outName);
    if (mode === "hero") await processHero(inputPath, outputPath);
    else await processStudio(inputPath, outputPath, background);
    console.log("OK", outName);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});