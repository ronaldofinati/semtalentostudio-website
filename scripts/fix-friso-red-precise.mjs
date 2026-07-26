import sharp from "sharp";

const input = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);

const L = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return -1;
  const i = (y * width + x) * channels;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

let count = 0;
for (let y = 815; y < 985; y++) {
  for (let x = 1180; x < width; x++) {
    const l = L(x, y);
    if (l < 0 || l > 55) continue;

    let whiteBelow = false;
    for (let dy = 1; dy <= 10; dy++) {
      if (L(x, y + dy) > 165) { whiteBelow = true; break; }
    }
    if (!whiteBelow) continue;

    let darkAbove = false;
    for (let dy = 1; dy <= 20; dy++) {
      if (L(x, y - dy) < 35) { darkAbove = true; break; }
    }
    if (!darkAbove) continue;

    const i = (y * width + x) * channels;
    out[i] = 196;
    out[i + 1] = 30;
    out[i + 2] = 40;
    count++;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(input);
console.log("changed", count);