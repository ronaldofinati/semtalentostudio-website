import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("public/projects/labcad");
const SRC_DIR = path.resolve("Assets/projects/labcad");
const COVER_W = 1920;
const COVER_H = 820;

const SOURCE_CANDIDATES = [
  path.join(SRC_DIR, "interface.png"),
  path.join(SRC_DIR, "interface.jpg"),
  path.join(SRC_DIR, "interface.jpeg"),
  path.join(SRC_DIR, "Tela Labcad.png"),
  path.join(SRC_DIR, "tela-labcad.png"),
  path.join(SRC_DIR, "screenshot.png"),
  path.join(SRC_DIR, "capa.png"),
  path.resolve("Assets/Tela Labcad.png"),
  path.resolve("D:/LabCad/interface.png"),
  path.resolve("D:/LabCad/screenshot.png"),
];

function findSourceImage() {
  for (const candidate of SOURCE_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }

  if (fs.existsSync(SRC_DIR)) {
    const fromFolder = fs
      .readdirSync(SRC_DIR)
      .filter((name) => /\.(png|jpe?g|webp)$/i.test(name))
      .sort()[0];
    if (fromFolder) return path.join(SRC_DIR, fromFolder);
  }

  return null;
}

function createInterfaceMockupSvg() {
  return Buffer.from(`<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#323232" stroke-width="1"/>
    </pattern>
    <linearGradient id="viewportGlow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1f1f1f"/>
      <stop offset="100%" stop-color="#141414"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="#2b2b2b"/>
  <rect x="0" y="0" width="1920" height="34" fill="#353535"/>
  <circle cx="18" cy="17" r="6" fill="#ff5f57"/>
  <circle cx="40" cy="17" r="6" fill="#febc2e"/>
  <circle cx="62" cy="17" r="6" fill="#28c840"/>
  <text x="90" y="22" fill="#d8d8d8" font-family="Segoe UI, Arial, sans-serif" font-size="13">LabCad</text>
  <rect x="0" y="34" width="1920" height="30" fill="#303030"/>
  <text x="18" y="53" fill="#c8c8c8" font-family="Segoe UI, Arial, sans-serif" font-size="12">Arquivo</text>
  <text x="88" y="53" fill="#c8c8c8" font-family="Segoe UI, Arial, sans-serif" font-size="12">Editar</text>
  <text x="145" y="53" fill="#c8c8c8" font-family="Segoe UI, Arial, sans-serif" font-size="12">Corpo de Forma</text>
  <text x="262" y="53" fill="#c8c8c8" font-family="Segoe UI, Arial, sans-serif" font-size="12">Curvas</text>
  <text x="325" y="53" fill="#c8c8c8" font-family="Segoe UI, Arial, sans-serif" font-size="12">Exibir</text>
  <text x="385" y="53" fill="#c8c8c8" font-family="Segoe UI, Arial, sans-serif" font-size="12">Debug</text>
  <rect x="0" y="64" width="72" height="1016" fill="#353535"/>
  <rect x="12" y="84" width="48" height="48" rx="6" fill="#424242" stroke="#5a5a5a"/>
  <rect x="12" y="144" width="48" height="48" rx="6" fill="#424242" stroke="#5a5a5a"/>
  <rect x="12" y="204" width="48" height="48" rx="6" fill="#8e2dc5" stroke="#b56be0"/>
  <rect x="72" y="64" width="1568" height="1016" fill="url(#viewportGlow)"/>
  <rect x="72" y="64" width="1568" height="1016" fill="url(#grid)"/>
  <line x1="820" y1="64" x2="820" y2="1080" stroke="#ff5050" stroke-width="1.5" opacity="0.75"/>
  <line x1="72" y1="620" x2="1640" y2="620" stroke="#50ff78" stroke-width="1.5" opacity="0.75"/>
  <path d="M 520 760 C 700 520, 980 470, 1180 560 S 1500 760, 1380 900" fill="none" stroke="#ff8c00" stroke-width="4"/>
  <path d="M 500 780 C 690 540, 970 490, 1170 580 S 1490 780, 1370 920" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.85"/>
  <circle cx="1180" cy="560" r="7" fill="#dc64ff" stroke="#ffffff" stroke-width="1.5"/>
  <circle cx="1380" cy="900" r="7" fill="#dc64ff" stroke="#ffffff" stroke-width="1.5"/>
  <rect x="1640" y="64" width="280" height="1016" fill="#2a2a2a" stroke="#3d3d3d"/>
  <text x="1660" y="92" fill="#d0d0d0" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="600">Camadas</text>
  <rect x="1660" y="108" width="240" height="28" rx="4" fill="#3f3f3f"/>
  <text x="1672" y="126" fill="#f0f0f0" font-family="Segoe UI, Arial, sans-serif" font-size="11">blueprint</text>
  <rect x="1660" y="144" width="240" height="28" rx="4" fill="#4b2f63" stroke="#8e2dc5"/>
  <text x="1672" y="162" fill="#f4e9ff" font-family="Segoe UI, Arial, sans-serif" font-size="11">last_profile</text>
  <rect x="1660" y="180" width="240" height="28" rx="4" fill="#3f3f3f"/>
  <text x="1672" y="198" fill="#f0f0f0" font-family="Segoe UI, Arial, sans-serif" font-size="11">insole</text>
  <rect x="0" y="1048" width="1920" height="32" fill="#303030"/>
  <text x="18" y="1068" fill="#9a9a9a" font-family="Consolas, monospace" font-size="11">Viewport  |  Grid: ON  |  Tema: Escuro  |  CAD/CAM/CAE calçadista</text>
  <text x="1680" y="1068" fill="#8e2dc5" font-family="Segoe UI, Arial, sans-serif" font-size="11">Em desenvolvimento</text>
</svg>`);
}

async function createCover(sourcePath) {
  const pipeline = sourcePath
    ? sharp(sourcePath)
    : sharp(createInterfaceMockupSvg(), { density: 144 });

  await pipeline
    .resize({ width: COVER_W, height: COVER_H, fit: "cover", position: "centre" })
    .sharpen({ sigma: 0.35 })
    .webp({ quality: 90, effort: 6 })
    .toFile(path.join(OUT_DIR, "cover.webp"));
}

async function main() {
  fs.mkdirSync(SRC_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const source = findSourceImage();
  await createCover(source);

  if (source) {
    console.log("OK cover.webp from", path.basename(source));
  } else {
    console.log("OK cover.webp from LabCad interface mockup");
    console.log("Tip: add Assets/projects/labcad/interface.png and rerun to use a real screenshot.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
