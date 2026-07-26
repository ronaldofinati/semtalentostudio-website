import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("Assets/projects/footwear/kids-playroom");
const HERO_W = 1920;
const HERO_H = 960;

const PAIRS = [
  { file: "01-tenis-menino.png", maxWidth: 360, left: 500, top: 360, shadow: { left: 540, top: 500, rx: 120, ry: 18 } },
  { file: "02-papete-menino.png", maxWidth: 340, left: 1040, top: 370, shadow: { left: 1080, top: 505, rx: 115, ry: 17 } },
  { file: "03-sapatilha-menina.png", maxWidth: 320, left: 470, top: 560, shadow: { left: 510, top: 680, rx: 105, ry: 16 } },
  { file: "04-sandalia-menina.png", maxWidth: 330, left: 1010, top: 555, shadow: { left: 1050, top: 685, rx: 110, ry: 16 } },
];

function floodFillBackground(pixels, width, height) {
  const visited = new Uint8Array(width * height);
  const isBackground = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push(x, 0, x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    queue.push(0, y, width - 1, y);
  }

  const matchesBackground = (x, y) => {
    const i = (y * width + x) * 4;
    const lum = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
    return lum < 118;
  };

  while (queue.length) {
    const y = queue.pop();
    const x = queue.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;

    const idx = y * width + x;
    if (visited[idx] || !matchesBackground(x, y)) continue;

    visited[idx] = 1;
    isBackground[idx] = 1;
    queue.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }

  for (let idx = 0; idx < width * height; idx++) {
    const i = idx * 4;
    if (isBackground[idx]) {
      pixels[i + 3] = 0;
      continue;
    }

    let edge = false;
    const px = idx % width;
    const py = Math.floor(idx / width);

    for (let dy = -1; dy <= 1 && !edge; dy++) {
      for (let dx = -1; dx <= 1 && !edge; dx++) {
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        if (isBackground[ny * width + nx]) edge = true;
      }
    }

    pixels[i + 3] = edge ? 210 : 255;
  }
}

async function extractCutout(inputPath) {
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixels = new Uint8Array(data);
  floodFillBackground(pixels, info.width, info.height);

  return sharp(Buffer.from(pixels), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();
}

async function resizePair(cutout, maxWidth) {
  const meta = await sharp(cutout).metadata();
  const width = meta.width ?? maxWidth;
  const height = meta.height ?? maxWidth;
  const scale = Math.min(1, maxWidth / width);

  return sharp(cutout)
    .resize({
      width: Math.round(width * scale),
      height: Math.round(height * scale),
      fit: "inside",
    })
    .png()
    .toBuffer();
}

function shadowSvg({ left, top, rx, ry }) {
  return Buffer.from(
    `<svg width="${HERO_W}" height="${HERO_H}" xmlns="http://www.w3.org/2000/svg"><ellipse cx="${left}" cy="${top}" rx="${rx}" ry="${ry}" fill="black" opacity="0.28"/></svg>`,
  );
}

async function main() {
  const bedroomPath = path.join(SRC, "00-bedroom-bg.png");
  if (!fs.existsSync(bedroomPath)) throw new Error("Missing bedroom background");

  const layers = [];

  for (const pair of PAIRS) {
    const inputPath = path.join(SRC, pair.file);
    if (!fs.existsSync(inputPath)) throw new Error("Missing: " + pair.file);

    layers.push({ input: shadowSvg(pair.shadow), left: 0, top: 0 });

    const cutout = await extractCutout(inputPath);
    const resized = await resizePair(cutout, pair.maxWidth);
    layers.push({ input: resized, left: pair.left, top: pair.top });
  }

  const heroPath = path.join(SRC, "00-hero.png");
  await sharp(bedroomPath)
    .resize({ width: HERO_W, height: HERO_H, fit: "cover", position: "centre" })
    .composite(layers)
    .sharpen({ sigma: 0.35 })
    .modulate({ brightness: 1.02, saturation: 1.03 })
    .png()
    .toFile(heroPath);

  console.log("OK", heroPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
