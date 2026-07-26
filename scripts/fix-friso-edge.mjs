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
const marked = new Set();
let count = 0;

// Paint pixel directly above each white sole pixel (top edge of foxing)
for (let y = 810; y < 1005; y++) {
  for (let x = 1080; x < width; x++) {
    const lHere = L(x, y);
    if (lHere < 145) continue; // must be on white/light sole

    for (let dy = 1; dy <= 4; dy++) {
      const yy = y - dy;
      const lAbove = L(x, yy);
      if (lAbove < 0) continue;
      if (lAbove > 95) continue; // stripe is dark

      // skip pure background black (no sole context)
      if (lAbove < 12 && lHere < 160) continue;

      const key = x + "," + yy;
      if (marked.has(key)) continue;
      marked.add(key);

      const i = (yy * width + x) * channels;
      out[i] = RED[0];
      out[i + 1] = RED[1];
      out[i + 2] = RED[2];
      count++;
      break;
    }
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log("edge stripe pixels:", count);