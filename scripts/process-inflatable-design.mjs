import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/inflaveis");
const OUT = path.resolve("public/projects/inflatable");
const CANVAS_W = 1600;
const CANVAS_H = 1200;

const GROUPS = [
  { id: "mario", folderPrefix: "01" },
  { id: "inflavel-medio", folderPrefix: "02" },
  { id: "inflavel-grande", folderPrefix: "03" },
  { id: "balao", folderPrefix: "04" },
  { id: "dino", folderPrefix: "05" },
];

function resolveFolder(prefix) {
  const match = fs
    .readdirSync(SRC, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .find((name) => name.startsWith(prefix));
  if (!match) throw new Error(`Folder not found for prefix: ${prefix}`);
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
    .composite([
      {
        input: product,
        left: Math.round((CANVAS_W - pw) / 2),
        top: Math.round((CANVAS_H - ph) / 2 - CANVAS_H * 0.03),
      },
    ])
    .webp({ quality: 90, effort: 6 })
    .toFile(outputPath);
}

async function createCover() {
  const grandeFolder = resolveFolder("03");
  const files = listImages(grandeFolder);
  const drone =
    files.find((name) => /drone/i.test(name)) ??
    files.find((name) => /perspective|perspectiva/i.test(name)) ??
    files[files.length - 1];

  if (!drone) return;

  await sharp(path.join(grandeFolder, drone))
    .resize({ width: 1920, height: 820, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.4 })
    .modulate({ brightness: 1.02, saturation: 1.04 })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(OUT, "cover.webp"));

  console.log("OK cover.webp");
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const background = await createStudioBackground();

  for (const group of GROUPS) {
    const folderPath = resolveFolder(group.folderPrefix);
    const files = listImages(folderPath);
    if (files.length === 0) throw new Error(`No images in ${folderPath}`);

    for (let index = 0; index < files.length; index++) {
      const outputName = `${group.id}-${String(index + 1).padStart(2, "0")}.webp`;
      await processFile(
        path.join(folderPath, files[index]),
        path.join(OUT, outputName),
        background,
      );
      console.log("OK", outputName);
    }
  }

  await createCover();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
