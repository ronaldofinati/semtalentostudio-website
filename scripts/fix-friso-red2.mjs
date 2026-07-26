import sharp from "sharp";
import fs from "fs";

const input = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";
// restore from generated backup if we had one - user original might be overwritten
// work on current file with improved detection

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);

const lum = (r,g,b) => 0.299*r + 0.587*g + 0.114*b;

for (let y = Math.floor(height * 0.62); y < height - 2; y++) {
  for (let x = Math.floor(width * 0.45); x < width - 2; x++) {
    const i = (y * width + x) * channels;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (lum(r,g,b) > 70) continue; // dark stripe only

    // white sole below within a few pixels
    let whiteBelow = false;
    for (let dy = 1; dy <= 8; dy++) {
      const j = ((y + dy) * width + x) * channels;
      if (lum(data[j], data[j+1], data[j+2]) > 200) { whiteBelow = true; break; }
    }
    // dark canvas or black above
    let darkAbove = false;
    for (let dy = 1; dy <= 6; dy++) {
      const j = ((y - dy) * width + x) * channels;
      if (lum(data[j], data[j+1], data[j+2]) < 45) { darkAbove = true; break; }
    }

    if (whiteBelow && darkAbove) {
      out[i] = 196; out[i+1] = 32; out[i+2] = 42;
    }
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(input);
console.log("OK refined");