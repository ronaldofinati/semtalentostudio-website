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
  const key = x + "," + y;
  if (painted.has(key)) return;
  const l = L(x, y);
  if (l < 0 || l > 88 || l < 11) return;
  const i = (y * width + x) * channels;
  out[i] = RED[0]; out[i + 1] = RED[1]; out[i + 2] = RED[2];
  painted.add(key);
  count++;
};

for (let y = 815; y < 1005; y++) {
  for (let x = 1090; x < width; x++) {
    if (L(x, y) < 140) continue;
    // up to 3 rows above white sole edge
    for (let dy = 1; dy <= 3; dy++) paint(x, y - dy);
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log("painted", count);