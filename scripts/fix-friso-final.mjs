import sharp from "sharp";

const input = "C:/Users/win10/.cursor/projects/C-Users-win10-AppData-Local-Temp-c52a991d-399f-4309-8454-2c1686c99f83/assets/urban-canvas-detalhe-cadarco.png";
const output = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);

const L = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return -1;
  const i = (y * width + x) * channels;
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
};

const RED = [196, 30, 40];
const painted = new Set();
let count = 0;

const paint = (x, y) => {
  const key = `${x},${y}`;
  if (painted.has(key)) return;
  const l = L(x, y);
  if (l < 14 || l > 105) return;
  const i = (y * width + x) * channels;
  out[i] = RED[0];
  out[i + 1] = RED[1];
  out[i + 2] = RED[2];
  painted.add(key);
  count++;
};

// Bottom-right sole corner only (exclude empty background columns)
for (let x = 1045; x < width; x++) {
  let topSoleY = -1;
  for (let y = 810; y < 1000; y++) {
    if (L(x, y) > 145) topSoleY = y;
  }
  if (topSoleY < 0) continue;

  // skip columns that are just background black
  if (L(x, height - 5) < 25 && L(x, topSoleY) < 180) continue;

  for (let dy = 1; dy <= 4; dy++) {
    paint(x, topSoleY - dy);
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log("painted", count);