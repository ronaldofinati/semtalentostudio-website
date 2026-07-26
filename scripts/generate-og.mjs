/**
 * Gera public/og.jpg no visual do hero da home
 * (fundo escuro, grade, glow, logo grande, tagline).
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
const LOGO = 380;
const GRID = 48;

function buildGridSvg() {
  const lines = [];
  const stroke = "rgba(169,171,174,0.12)";
  for (let x = 0; x <= W; x += GRID) {
    lines.push(
      `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${stroke}" stroke-width="1"/>`,
    );
  }
  for (let y = 0; y <= H; y += GRID) {
    lines.push(
      `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${stroke}" stroke-width="1"/>`,
    );
  }
  return lines.join("");
}

const logoPng = await sharp(logoPath)
  .resize(LOGO, LOGO, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const base = await sharp({
  create: {
    width: W,
    height: H,
    channels: 3,
    background: { r: 10, g: 10, b: 10 },
  },
})
  .png()
  .toBuffer();

const atmosphere = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="top" cx="50%" cy="0%" r="75%">
      <stop offset="0%" stop-color="#161616"/>
      <stop offset="65%" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#c8a96e" stop-opacity="0.20"/>
      <stop offset="50%" stop-color="#c8a96e" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#c8a96e" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gridFade" cx="50%" cy="42%" r="68%">
      <stop offset="15%" stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </radialGradient>
    <mask id="gridMask">
      <rect width="100%" height="100%" fill="url(#gridFade)"/>
    </mask>
    <linearGradient id="title" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f5f5f5"/>
      <stop offset="50%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#c4c6c9"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#top)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>
  <g opacity="0.45" mask="url(#gridMask)">
    ${buildGridSvg()}
  </g>
  <text
    x="600"
    y="548"
    text-anchor="middle"
    font-family="Segoe UI, Arial, Helvetica, sans-serif"
    font-size="52"
    font-weight="600"
    letter-spacing="-0.8"
    fill="url(#title)"
  >Sem Talento Studio</text>
</svg>
`);

const logoLeft = Math.round((W - LOGO) / 2);
const logoTop = 70;

await sharp(base)
  .composite([
    { input: atmosphere, top: 0, left: 0 },
    { input: logoPng, top: logoTop, left: logoLeft },
  ])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outPath);

const stat = fs.statSync(outPath);
console.log("OK:", outPath, `(${Math.round(stat.size / 1024)} KB)`);
