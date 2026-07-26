import sharp from "sharp";

const input = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);
const lum = (r,g,b) => 0.299*r + 0.587*g + 0.114*b;
let count = 0;

for (let x = Math.floor(width * 0.48); x < width; x++) {
  let firstWhiteY = -1;
  for (let y = height - 1; y >= Math.floor(height * 0.58); y--) {
    const i = (y * width + x) * channels;
    if (lum(data[i], data[i+1], data[i+2]) > 195) { firstWhiteY = y; break; }
  }
  if (firstWhiteY < 0) continue;

  for (let y = firstWhiteY - 1; y >= firstWhiteY - 8 && y >= 0; y--) {
    const i = (y * width + x) * channels;
    const L = lum(data[i], data[i+1], data[i+2]);
    if (L < 85) {
      out[i] = 196; out[i+1] = 30; out[i+2] = 40;
      count++;
    } else break;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(input);
console.log("pixels changed:", count);