/**
 * Restores full letters + shapes, stamps multilingual footer on all SVGs,
 * rebuilds catalog with mode: draw|color.
 * Run: node scripts/update-desenhar-colorir.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "public", "education", "colorir", "pages");
const CATALOG_TS = path.join(ROOT, "src", "data", "colorir-catalog.ts");
const CATALOG_JSON = path.join(ROOT, "public", "education", "colorir", "catalog.json");

const VB_W = 794;
const VB_H = 1123;
const CX = VB_W / 2;
const CY = VB_H / 2;
const S = 'fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const SF = 'fill="none" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"';
const ATTRIB = "Sem Talento Studio";

const FOOTER = `<g id="sts-complete-footer" font-family="Arial, Helvetica, sans-serif" fill="#555" text-anchor="middle">
  <text x="${CX}" y="1008" font-size="14">Completar e colorir</text>
  <text x="${CX}" y="1028" font-size="13">Complete and color</text>
  <text x="${CX}" y="1048" font-size="13">Completar y colorear</text>
  <text x="${CX}" y="1068" font-size="13">完成并涂色</text>
</g>`;

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function wrap(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${VB_W}" height="${VB_H}">\n<rect width="${VB_W}" height="${VB_H}" fill="#fff"/>\n${inner}\n${FOOTER}\n</svg>\n`;
}
function c(cx, cy, r, a = S) { return `<circle cx="${cx}" cy="${cy}" r="${r}" ${a}/>`; }
function e(cx, cy, rx, ry, a = S) { return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${a}/>`; }
function rect(x, y, w, h, rx = 0, a = S) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${a}/>`; }
function p(d, a = S) { return `<path d="${d}" ${a}/>`; }
function poly(pts, a = S) { return `<polygon points="${pts}" ${a}/>`; }
function line(x1, y1, x2, y2, a = S) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${a}/>`; }
function g(content) { return `<g>${content}</g>`; }
function starPts(cx, cy, spikes, outer, inner) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const ang = (Math.PI / spikes) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? outer : inner;
    pts.push(`${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`);
  }
  return pts.join(" ");
}
function starShape(cx, cy, s) { return poly(starPts(cx, cy, 5, s, s * 0.4)); }
function heart(cx, cy, size) {
  const s = size;
  return p(`M ${cx} ${cy + s * 0.35} C ${cx - s} ${cy - s * 0.2}, ${cx - s * 0.5} ${cy - s}, ${cx} ${cy - s * 0.45} C ${cx + s * 0.5} ${cy - s}, ${cx + s} ${cy - s * 0.2}, ${cx} ${cy + s * 0.35} Z`);
}
function flower(cx, cy, petals, rOuter, rInner) {
  let out = "";
  for (let i = 0; i < petals; i++) {
    const a = (Math.PI * 2 * i) / petals - Math.PI / 2;
    out += e(cx + Math.cos(a) * rOuter * 0.55, cy + Math.sin(a) * rOuter * 0.55, rOuter * 0.35, rOuter * 0.22);
  }
  return out + c(cx, cy, rInner);
}
function moon(cx, cy, s) {
  return p(`M ${cx + s * 0.35} ${cy - s * 0.85} A ${s} ${s} 0 1 0 ${cx + s * 0.35} ${cy + s * 0.85} A ${s * 0.7} ${s * 0.7} 0 1 1 ${cx + s * 0.35} ${cy - s * 0.85} Z`) + c(cx - s * 0.15, cy - s * 0.2, s * 0.12) + c(cx + s * 0.05, cy + s * 0.25, s * 0.08);
}
function bubbleLetter(ch, cx, cy, size) {
  return `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" font-family="Arial Black, Arial, sans-serif" font-size="${size}" fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round">${esc(ch)}</text>`;
}
function frameDecor(variant) {
  if (variant % 3 === 0) return rect(40, 40, VB_W - 80, VB_H - 80, 24, SF) + rect(55, 55, VB_W - 110, VB_H - 110, 18, SF);
  if (variant % 3 === 1) return c(70, 70, 18, SF) + c(VB_W - 70, 70, 18, SF) + c(70, VB_H - 70, 18, SF) + c(VB_W - 70, VB_H - 70, 18, SF);
  return line(50, 80, 120, 80, SF) + line(VB_W - 120, 80, VB_W - 50, 80, SF) + line(50, VB_H - 80, 120, VB_H - 80, SF) + line(VB_W - 120, VB_H - 80, VB_W - 50, VB_H - 80, SF);
}

const letterEntries = [];
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (let i = 0; i < letters.length; i++) {
  const n = 120 + i;
  const ch = letters[i];
  const id = `colorir-${String(n).padStart(3, "0")}`;
  const inner = frameDecor(n) + bubbleLetter(ch, CX, CY - 40, 320) + flower(CX - 200, CY + 280, 5, 35, 12) + flower(CX + 200, CY + 280, 6, 35, 12);
  fs.writeFileSync(path.join(PAGES_DIR, `${id}.svg`), wrap(inner), "utf8");
  letterEntries.push({
    id, file: `/education/colorir/pages/${id}.svg`, titlePt: `Letra ${ch}`,
    category: "letters", mode: "draw", license: "CC0", attribution: ATTRIB, printFriendly: true,
  });
}

const shapeBuilders = [
  ["Circulo", () => c(CX, CY, 160)],
  ["Quadrado", () => rect(CX - 140, CY - 140, 280, 280, 8)],
  ["Triangulo", () => poly(`${CX},${CY - 160} ${CX - 160},${CY + 140} ${CX + 160},${CY + 140}`)],
  ["Estrela", () => starShape(CX, CY, 160)],
  ["Coracao", () => heart(CX, CY, 140)],
  ["Losango", () => poly(`${CX},${CY - 160} ${CX + 140},${CY} ${CX},${CY + 160} ${CX - 140},${CY}`)],
  ["Hexagono", () => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      pts.push(`${CX + Math.cos(a) * 150},${CY + Math.sin(a) * 150}`);
    }
    return poly(pts.join(" "));
  }],
  ["Oval", () => e(CX, CY, 140, 200)],
  ["Lua crescente", () => moon(CX, CY, 140)],
  ["Cruz", () => rect(CX - 40, CY - 140, 80, 280, 8) + rect(CX - 140, CY - 40, 280, 80, 8)],
  ["Seta", () => poly(`${CX},${CY - 160} ${CX + 120},${CY} ${CX + 50},${CY} ${CX + 50},${CY + 160} ${CX - 50},${CY + 160} ${CX - 50},${CY} ${CX - 120},${CY}`)],
  ["Meia-lua", () => p(`M ${CX + 40} ${CY - 140} A 150 150 0 1 0 ${CX + 40} ${CY + 140} A 100 100 0 1 1 ${CX + 40} ${CY - 140} Z`)],
];

const shapeEntries = [];
let shapeId = 156;
for (const [name, fn] of shapeBuilders) {
  for (const [suffix, draw] of [
    ["", fn],
    [" decorado", () => fn() + c(CX - 220, CY - 280, 20) + c(CX + 220, CY - 280, 20) + c(CX - 220, CY + 280, 20) + c(CX + 220, CY + 280, 20)],
  ]) {
    const id = `colorir-${String(shapeId).padStart(3, "0")}`;
    const inner = frameDecor(shapeId) + draw();
    fs.writeFileSync(path.join(PAGES_DIR, `${id}.svg`), wrap(inner), "utf8");
    shapeEntries.push({
      id, file: `/education/colorir/pages/${id}.svg`, titlePt: name + suffix,
      category: "shapes", mode: "draw", license: "CC0", attribution: ATTRIB, printFriendly: true,
    });
    shapeId++;
  }
}

// Stamp footer on ALL other existing SVGs
let stamped = 0;
for (const f of fs.readdirSync(PAGES_DIR)) {
  if (!f.endsWith(".svg")) continue;
  const full = path.join(PAGES_DIR, f);
  let svg = fs.readFileSync(full, "utf8");
  if (svg.includes('id="sts-complete-footer"')) {
    // refresh footer block
    svg = svg.replace(/<g id="sts-complete-footer"[\s\S]*?<\/g>\s*/g, "");
  }
  if (!svg.includes("</svg>")) continue;
  svg = svg.replace("</svg>", `${FOOTER}\n</svg>`);
  fs.writeFileSync(full, svg, "utf8");
  stamped++;
}

// Rebuild catalog from current TS (non letters/shapes) + new letters/shapes
const oldTs = fs.readFileSync(CATALOG_TS, "utf8");
const oldPages = [...oldTs.matchAll(
  /\{ id: "([^"]+)", file: "([^"]+)", titlePt: "([^"]+)", category: "([^"]+)"[^}]*\}/g,
)].map((m) => ({
  id: m[1],
  file: m[2],
  titlePt: m[3],
  category: m[4],
  mode: m[2].endsWith(".png") ? "color" : "draw",
  license: "CC0",
  attribution: ATTRIB,
  printFriendly: true,
})).filter((p) => p.category !== "letters" && p.category !== "shapes");

const categoriesOrder = [
  "animals", "farm", "forest", "bugs", "vehicles", "nature", "fairytales",
  "letters", "numbers", "shapes", "scenes", "food", "space",
];

const allPages = [...oldPages, ...letterEntries, ...shapeEntries];
allPages.sort((a, b) => {
  const ca = categoriesOrder.indexOf(a.category);
  const cb = categoriesOrder.indexOf(b.category);
  if (ca !== cb) return (ca < 0 ? 99 : ca) - (cb < 0 ? 99 : cb);
  const am = a.mode === "color" ? 0 : 1;
  const bm = b.mode === "color" ? 0 : 1;
  if (am !== bm) return am - bm;
  return a.titlePt.localeCompare(b.titlePt, "pt");
});

const catUnion = [...new Set(allPages.map((p) => p.category))];
const categories = categoriesOrder.filter((c) => catUnion.includes(c));

function jesc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const tsOut = `export type ColorirCategory =
${categories.map((c) => `  | "${c}"`).join("\n")};

export type ColorirMode = "draw" | "color";

export type ColorirPage = {
  id: string;
  file: string;
  titlePt: string;
  category: ColorirCategory;
  mode: ColorirMode;
  license: "CC0";
  attribution: string;
  printFriendly: boolean;
};

export const colorirPages: ColorirPage[] = [
${allPages
  .map(
    (p) =>
      `  { id: "${p.id}", file: "${p.file}", titlePt: "${jesc(p.titlePt)}", category: "${p.category}", mode: "${p.mode}", license: "CC0", attribution: "${ATTRIB}", printFriendly: true },`,
  )
  .join("\n")}
];

export const colorirCategories: ColorirCategory[] = [
  ${categories.map((c) => `"${c}"`).join(", ")},
];
`;

fs.writeFileSync(CATALOG_TS, tsOut, "utf8");
fs.writeFileSync(CATALOG_JSON, JSON.stringify({ pages: allPages, categories }, null, 2), "utf8");

const counts = {};
for (const p of allPages) counts[p.category] = (counts[p.category] || 0) + 1;
console.log("letters", letterEntries.length, "shapes", shapeEntries.length);
console.log("stamped SVGs", stamped);
console.log("total", allPages.length);
console.log("draw", allPages.filter((p) => p.mode === "draw").length, "color", allPages.filter((p) => p.mode === "color").length);
console.log(counts);