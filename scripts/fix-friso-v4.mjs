import sharp from "sharp";

const input = "C:/Users/win10/.cursor/projects/C-Users-win10-AppData-Local-Temp-c52a991d-399f-4309-8454-2c1686c99f83/assets/urban-canvas-detalhe-cadarco.png";
const output = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);

const get = (x, y) => {
  if (x < 0 || y < 0 || x >= width || y >= height) return null;
  const i = (y * width + x) * channels;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const L = 0.299 * r + 0.587 * g + 0.114 * b;
  return { i, r, g, b, L };
};

// Red foxing stripe: dark line on white sole at canvas boundary (bottom-right sole corner)
const RED = [196, 30, 40];
let count = 0;

for (let y = 805; y < 1005; y++) {
  for (let x = 1080; x < width; x++) {
    const p = get(x, y);
    if (!p || p.L > 62 || p.L < 12) continue;

    // white sole below (foxing body)
    let soleBelow = false;
    for (let dy = 1; dy <= 18; dy++) {
      const q = get(x, y + dy);
      if (q && q.L > 150) { soleBelow = true; break; }
    }
    if (!soleBelow) continue;

    // canvas black above (upper)
    let canvasAbove = false;
    for (let dy = 1; dy <= 30; dy++) {
      const q = get(x, y - dy);
      if (q && q.L < 42) { canvasAbove = true; break; }
    }
    if (!canvasAbove) continue;

    // exclude background pure black with no white nearby at same x lower
    const qBottom = get(x, Math.min(height - 1, y + 25));
    if (qBottom && qBottom.L < 20) continue;

    out[p.i] = RED[0];
    out[p.i + 1] = RED[1];
    out[p.i + 2] = RED[2];
    count++;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log("changed pixels:", count);