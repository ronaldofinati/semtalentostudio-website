import sharp from "sharp";

const input = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);
const lum = (r,g,b) => 0.299*r + 0.587*g + 0.114*b;

const get = (x,y) => {
  if (x<0||y<0||x>=width||y>=height) return null;
  const i=(y*width+x)*channels;
  return { r:data[i], g:data[i+1], b:data[i+2], L:lum(data[i],data[i+1],data[i+2]), i };
};

let count = 0;
for (let y = Math.floor(height * 0.72); y < height; y++) {
  for (let x = Math.floor(width * 0.52); x < width; x++) {
    const p = get(x,y);
    if (!p || p.L > 72 || p.L < 35) continue;

    let whiteBelow = false;
    for (let dy = 1; dy <= 20; dy++) {
      const q = get(x, y+dy);
      if (q && q.L > 175) { whiteBelow = true; break; }
    }
    if (!whiteBelow) continue;

    let darkAbove = false;
    for (let dy = 1; dy <= 25; dy++) {
      const q = get(x, y-dy);
      if (q && q.L < 40) { darkAbove = true; break; }
    }
    if (!darkAbove) continue;

    out[p.i] = 196; out[p.i+1] = 30; out[p.i+2] = 40;
    count++;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(input);
console.log("restored + changed pixels:", count);