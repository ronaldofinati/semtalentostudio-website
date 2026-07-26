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

const RED = [210, 35, 45];
let count = 0;

for (let y = 818; y < 992; y++) {
  for (let x = 1042; x < width; x++) {
    const l = L(x, y);
    if (l < 22 || l > 102) continue;

    let soleBelow = false;
    for (let dy = 1; dy <= 14; dy++) {
      if (L(x, y + dy) > 135) { soleBelow = true; break; }
    }
    if (!soleBelow) continue;

    let canvasAbove = false;
    for (let dy = 1; dy <= 18; dy++) {
      const la = L(x, y - dy);
      if (la >= 0 && la < 38) { canvasAbove = true; break; }
    }
    if (!canvasAbove) continue;

    const i = (y * width + x) * channels;
    out[i] = RED[0];
    out[i + 1] = RED[1];
    out[i + 2] = RED[2];
    count++;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log("ok", count);