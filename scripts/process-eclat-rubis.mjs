import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const SRC = path.resolve("Assets/projects/footwear/eclat-95-rubis");
const OUT = path.resolve("public/projects/footwear");
const CANVAS_W = 1600, CANVAS_H = 1200;
const MAP = [["01-lateral.png","eclat-95-rubis-01.webp"],["02-perspectiva.png","eclat-95-rubis-02.webp"],["03-top.png","eclat-95-rubis-03.webp"],["04-sola.png","eclat-95-rubis-04.webp"]];
async function bg() {
  const svg = `<svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="50%" cy="42%" r="55%"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="55%" stop-color="#141414"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="a" cx="50%" cy="75%" r="40%"><stop offset="0%" stop-color="#c8a96e" stop-opacity="0.12"/><stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#a)"/><ellipse cx="50%" cy="88%" rx="38%" ry="6%" fill="#000" opacity="0.45"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
const background = await bg();
for (const [s,o] of MAP) {
  const meta = await sharp(path.join(SRC,s)).metadata();
  const t = Math.max(meta.width??0,meta.height??0)>1800?1300:1100;
  const product = await sharp(path.join(SRC,s)).rotate().resize({width:t,height:t,fit:"inside",withoutEnlargement:false}).sharpen({sigma:0.5}).modulate({brightness:1.04,saturation:1.08}).toBuffer();
  const pm = await sharp(product).metadata();
  const pw=pm.width??t, ph=pm.height??t;
  await sharp(background).composite([{input:product,left:Math.round((CANVAS_W-pw)/2),top:Math.round((CANVAS_H-ph)/2-CANVAS_H*0.03)}]).webp({quality:90,effort:6}).toFile(path.join(OUT,o));
  console.log("OK",o);
}