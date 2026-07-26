import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

async function rotateFile(rel) {
  const p = path.resolve(rel);
  const buf = await sharp(p).rotate(90).toBuffer();
  const meta = await sharp(buf).metadata();
  const isWebp = p.endsWith(".webp");
  const out = isWebp
    ? await sharp(buf).webp({ quality: 90, effort: 6 }).toBuffer()
    : await sharp(buf).png().toBuffer();
  fs.writeFileSync(p, out);
  console.log("rotated", rel, meta.width + "x" + meta.height);
}

await rotateFile("public/projects/footwear/etoile-pointe-03.webp");
await rotateFile("Assets/projects/footwear/etoile-pointe/03-par-top.png");