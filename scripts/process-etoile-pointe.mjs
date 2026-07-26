import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const SRC = path.resolve("Assets/projects/footwear/etoile-pointe");
const OUT = path.resolve("public/projects/footwear");
const W = 1600, H = 1200;
const MAP = [["01-par-frente.png","etoile-pointe-01.webp"],["02-par-angulo.png","etoile-pointe-02.webp"],["03-par-top.png","etoile-pointe-03.webp"],["04-detalhe-caixa.png","etoile-pointe-04.webp"]];
async function bg() {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="g" cx="50%" cy="40%" r="58%"><stop offset="0%" stop-color="#2d2826"/><stop offset="50%" stop-color="#161412"/><stop offset="100%" stop-color="#0a0a0a"/></radialGradient><radialGradient id="w" cx="50%" cy="30%" r="45%"><stop offset="0%" stop-color="#e8c4a8" stop-opacity="0.08"/><stop offset="100%" stop-color="#e8c4a8" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#w)"/><ellipse cx="50%" cy="90%" rx="42%" ry="5%" fill="#000" opacity="0.5"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}
const background = await bg();
for (const [s,o] of MAP) {
  const meta = await sharp(path.join(SRC,s)).metadata();
  const t = Math.max(meta.width??0,meta.height??0)>1800?1400:1200;
  const product = await sharp(path.join(SRC,s)).rotate().resize({width:t,height:t,fit:"inside",withoutEnlargement:false}).sharpen({sigma:0.45}).modulate({brightness:1.03,saturation:1.05}).toBuffer();
  const pm = await sharp(product).metadata();
  const pw=pm.width??t, ph=pm.height??t;
  await sharp(background).composite([{input:product,left:Math.round((W-pw)/2),top:Math.round((H-ph)/2-H*0.02)}]).webp({quality:90,effort:6}).toFile(path.join(OUT,o));
  console.log("OK",o);
}