import sharp from "sharp";

const input = "Assets/projects/footwear/urban-canvas/04-detalhe-cadarco.png";
const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
const out = Buffer.from(data);
const lum = (r,g,b) => 0.299*r + 0.587*g + 0.114*b;
const getL = (x,y) => {
  if (x<0||y<0||x>=width||y>=height) return -1;
  const i=(y*width+x)*channels;
  return lum(data[i],data[i+1],data[i+2]);
};

const xMin = Math.floor(width * 0.68);
const yMin = Math.floor(height * 0.82);
let count = 0;

for (let y = yMin; y < height; y++) {
  for (let x = xMin; x < width; x++) {
    const L = getL(x,y);
    if (L < 0 || L > 70) continue;

    // must have bright sole below within 1-12px
    let soleBelow = false;
    for (let dy = 1; dy <= 12; dy++) {
      const Lb = getL(x, y+dy);
      if (Lb > 170) { soleBelow = true; break; }
    }
    if (!soleBelow) continue;

    // must NOT be deep canvas (needs mid/white nearby below stripe within sole)
    const i = (y*width+x)*channels;
    out[i]=196; out[i+1]=30; out[i+2]=40;
    count++;
  }
}

await sharp(out, { raw: { width, height, channels } }).png().toFile(input);
console.log("pixels:", count, "region x>", xMin, "y>", yMin);