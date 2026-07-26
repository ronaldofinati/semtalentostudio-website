/**
 * Gera public/og.jpg (1200x630) — logo + nome para WhatsApp/Facebook/etc.
 * Uso: node scripts/generate-og.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(".");
const logoPath = path.join(root, "public", "assets", "logo.svg");
const outPath = path.join(root, "public", "og.jpg");

const W = 1200;
const H = 630;
const LOGO = 340;

const logoPng = await sharp(logoPath)
  .resize(LOGO, LOGO, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const background = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 10, g: 10, b: 10 },
  },
})
  .png()
  .toBuffer();

const overlaySvg = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#c8a96e" stop-opacity="0.14"/>
      <stop offset="55%" stop-color="#a9abae" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <text
    x="600"
    y="545"
    text-anchor="middle"
    font-family="Segoe UI, Arial, Helvetica, sans-serif"
    font-size="54"
    font-weight="600"
    letter-spacing="-0.5"
  >
    <tspan fill="#f5f5f5">SemTalento</tspan><tspan fill="#a9abae"> Studio</tspan>
  </text>
  <rect x="560" y="568" width="80" height="3" rx="1.5" fill="#c8a96e"/>
</svg>
`);

const logoLeft = Math.round((W - LOGO) / 2);
const logoTop = 95;

await sharp(background)
  .composite([
    { input: overlaySvg, top: 0, left: 0 },
    { input: logoPng, top: logoTop, left: logoLeft },
  ])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outPath);

const stat = fs.statSync(outPath);
console.log("OK:", outPath, `(${Math.round(stat.size / 1024)} KB)`);
