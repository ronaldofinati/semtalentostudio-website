import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("Assets/email");
const LOGO = path.resolve("public/assets/logo.svg");

const W = 620;
const H = 150;

const signatureSvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect x="0" y="0" width="5" height="${H}" fill="#c8a96e"/>
  <text x="118" y="42" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="#1a1a1a">Sem Talento Studio</text>
  <text x="118" y="68" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#666666">Design de cal&#231;ados, produtos e ferramentas digitais</text>
  <text x="118" y="98" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#c8a96e">contato@semtalentostudio.com.br</text>
  <text x="118" y="122" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#737578">www.semtalentostudio.com.br</text>
</svg>`);

async function buildSignature(width, height, logoHeight, outFile) {
  const logo = await sharp(LOGO).resize({ height: logoHeight, fit: "inside" }).png().toBuffer();
  const logoMeta = await sharp(logo).metadata();
  const logoH = logoMeta.height ?? logoHeight;

  const base = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#ffffff"/>
    <rect x="0" y="0" width="5" height="${height}" fill="#c8a96e"/>
    <text x="118" y="42" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="600" fill="#1a1a1a">Sem Talento Studio</text>
    <text x="118" y="68" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#666666">Design de cal&#231;ados, produtos e ferramentas digitais</text>
    <text x="118" y="98" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#c8a96e">contato@semtalentostudio.com.br</text>
    <text x="118" y="122" font-family="Segoe UI, Arial, sans-serif" font-size="12" fill="#737578">www.semtalentostudio.com.br</text>
  </svg>`);

  await sharp(base)
    .composite([{ input: logo, left: 24, top: Math.round((height - logoH) / 2) }])
    .png()
    .toFile(outFile);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
await buildSignature(W, H, 72, path.join(OUT_DIR, "assinatura-email.png"));
await buildSignature(W * 2, H * 2, 144, path.join(OUT_DIR, "assinatura-email-2x.png"));
console.log("OK", path.join(OUT_DIR, "assinatura-email.png"));
