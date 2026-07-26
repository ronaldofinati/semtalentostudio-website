import sharp from "sharp";

const input = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";
const output = input;

const img = sharp(input);
const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);

const isWhite = (r, g, b) => r > 210 && g > 210 && b > 210;
const isDark = (r, g, b) => r < 55 && g < 55 && b < 55;

for (let y = Math.floor(height * 0.55); y < height; y++) {
  for (let x = Math.floor(width * 0.35); x < width; x++) {
    const i = (y * width + x) * channels;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (!isDark(r, g, b)) continue;

    let nearWhite = false;
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const j = (ny * width + nx) * channels;
        if (isWhite(data[j], data[j + 1], data[j + 2])) nearWhite = true;
      }
    }
    if (!nearWhite) continue;

    // red stripe on sole border
    out[i] = 190;
    out[i + 1] = 28;
    out[i + 2] = 38;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(output);
console.log("OK", output);