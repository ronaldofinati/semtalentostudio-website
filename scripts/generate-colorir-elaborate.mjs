/**
 * Appends 100 elaborate CC0 SVG coloring pages (colorir-281..380).
 * Keeps existing pages. Updates catalog.ts + catalog.json.
 * Run: node scripts/generate-colorir-elaborate.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "public", "education", "colorir", "pages");
const CATALOG_TS = path.join(ROOT, "src", "data", "colorir-catalog.ts");
const CATALOG_JSON = path.join(ROOT, "public", "education", "colorir", "catalog.json");

const W = 794;
const H = 1123;
const CX = W / 2;
const CY = H / 2;
const S = 'fill="none" stroke="#111" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"';
const SF = 'fill="none" stroke="#111" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"';

const wrap = (inner) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">\n<rect width="${W}" height="${H}" fill="#fff"/>\n${inner}\n</svg>\n`;

const c = (x, y, r, a = S) => `<circle cx="${x}" cy="${y}" r="${r}" ${a}/>`;
const e = (x, y, rx, ry, a = S) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${a}/>`;
const r = (x, y, w, h, rx = 0, a = S) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${a}/>`;
const p = (d, a = S) => `<path d="${d}" ${a}/>`;
const poly = (pts, a = S) => `<polygon points="${pts}" ${a}/>`;
const line = (x1, y1, x2, y2, a = S) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${a}/>`;

function starPts(x, y, n, out, inn) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const ang = (Math.PI / n) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? out : inn;
    pts.push(`${x + Math.cos(ang) * rad},${y + Math.sin(ang) * rad}`);
  }
  return pts.join(" ");
}
const star = (x, y, s, n = 5) => poly(starPts(x, y, n, s, s * 0.42));

function flower(x, y, petals, ro, ri) {
  let o = "";
  for (let i = 0; i < petals; i++) {
    const a = (Math.PI * 2 * i) / petals - Math.PI / 2;
    o += e(x + Math.cos(a) * ro * 0.55, y + Math.sin(a) * ro * 0.55, ro * 0.34, ro * 0.2);
  }
  return o + c(x, y, ri);
}

function sun(x, y, rad, rays = 12) {
  let o = c(x, y, rad) + c(x, y, rad * 0.5, SF);
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays;
    o += line(
      x + Math.cos(a) * (rad + 8),
      y + Math.sin(a) * (rad + 8),
      x + Math.cos(a) * (rad + 36),
      y + Math.sin(a) * (rad + 36),
    );
  }
  return o;
}

function cloud(x, y, s) {
  return (
    e(x, y, s * 1.25, s * 0.65) +
    c(x - s * 0.7, y + s * 0.08, s * 0.5) +
    c(x + s * 0.7, y + s * 0.08, s * 0.48) +
    c(x, y - s * 0.35, s * 0.55)
  );
}

function grass(y, n = 20) {
  let o = line(50, y, W - 50, y);
  for (let i = 0; i < n; i++) {
    const x = 70 + i * ((W - 140) / n);
    o += p(`M ${x} ${y} Q ${x - 5} ${y - 20} ${x} ${y - 32} Q ${x + 5} ${y - 20} ${x} ${y}`);
  }
  return o;
}

function frame() {
  let o = r(34, 34, W - 68, H - 68, 26, SF) + r(50, 50, W - 100, H - 100, 18, SF);
  for (const [x, y] of [
    [78, 78],
    [W - 78, 78],
    [78, H - 78],
    [W - 78, H - 78],
  ]) {
    o += flower(x, y, 6, 20, 6);
  }
  return o;
}

function mandala(x, y, layers) {
  let o = "";
  for (let L = layers; L >= 1; L--) {
    const R = 36 + L * 36;
    const petals = 6 + L * 2;
    o += c(x, y, R, L % 2 ? S : SF);
    for (let i = 0; i < petals; i++) {
      const a = (Math.PI * 2 * i) / petals - Math.PI / 2;
      o += e(x + Math.cos(a) * R * 0.7, y + Math.sin(a) * R * 0.7, 16 + L * 3, 9 + L * 2, SF);
    }
  }
  return o + c(x, y, 26) + star(x, y, 16, 8);
}

function tree(x, baseY, h) {
  let o = r(x - h * 0.08, baseY - h * 0.38, h * 0.16, h * 0.38, 6);
  o += c(x, baseY - h * 0.52, h * 0.3);
  o += c(x - h * 0.2, baseY - h * 0.38, h * 0.22);
  o += c(x + h * 0.2, baseY - h * 0.38, h * 0.22);
  o += c(x, baseY - h * 0.68, h * 0.18);
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5;
    o += c(x + Math.cos(a) * h * 0.16, baseY - h * 0.52 + Math.sin(a) * h * 0.16, 5, SF);
  }
  return o;
}

function house(x, baseY, w) {
  const h = w * 0.7;
  let o = r(x - w / 2, baseY - h, w, h, 6);
  o += poly(
    `${x - w / 2 - 20},${baseY - h} ${x},${baseY - h - w * 0.38} ${x + w / 2 + 20},${baseY - h}`,
  );
  o += r(x - w * 0.12, baseY - h * 0.48, w * 0.24, h * 0.48, 3);
  o += r(x - w * 0.36, baseY - h * 0.7, w * 0.2, w * 0.18, 3);
  o += r(x + w * 0.16, baseY - h * 0.7, w * 0.2, w * 0.18, 3);
  o += line(x - w * 0.26, baseY - h * 0.7, x - w * 0.26, baseY - h * 0.7 + w * 0.18, SF);
  o += line(x - w * 0.36, baseY - h * 0.61, x - w * 0.16, baseY - h * 0.61, SF);
  o += line(x + w * 0.26, baseY - h * 0.7, x + w * 0.26, baseY - h * 0.7 + w * 0.18, SF);
  o += line(x + w * 0.16, baseY - h * 0.61, x + w * 0.36, baseY - h * 0.61, SF);
  o += flower(x - w * 0.52, baseY - 18, 5, 16, 5);
  o += flower(x + w * 0.52, baseY - 18, 6, 15, 5);
  return o;
}

function castle(x, baseY, w) {
  const h = w * 0.85;
  let o = r(x - w / 2, baseY - h, w, h, 4);
  o += r(x - w / 2 - w * 0.2, baseY - h * 1.12, w * 0.26, h * 1.12, 4);
  o += r(x + w / 2 - w * 0.06, baseY - h * 1.12, w * 0.26, h * 1.12, 4);
  o += poly(
    `${x - w / 2 - w * 0.2},${baseY - h * 1.12} ${x - w / 2 - w * 0.07},${baseY - h * 1.35} ${x - w / 2 + w * 0.06},${baseY - h * 1.12}`,
  );
  o += poly(
    `${x + w / 2 - w * 0.06},${baseY - h * 1.12} ${x + w / 2 + w * 0.07},${baseY - h * 1.35} ${x + w / 2 + w * 0.2},${baseY - h * 1.12}`,
  );
  o += r(x - w * 0.1, baseY - h * 0.42, w * 0.2, h * 0.42, 2);
  o += e(x - w * 0.26, baseY - h * 0.68, w * 0.09, w * 0.12);
  o += e(x + w * 0.26, baseY - h * 0.68, w * 0.09, w * 0.12);
  for (let i = 0; i < 5; i++) {
    o += r(x - w / 2 + 8 + i * (w / 5), baseY - h - 16, w * 0.1, 16, 2);
  }
  return o;
}

function cat(x, y, s) {
  let o = e(x, y + s * 0.5, s * 0.8, s * 0.65);
  o += e(x, y - s * 0.12, s * 0.68, s * 0.58);
  o += poly(`${x - s * 0.5},${y - s * 0.5} ${x - s * 0.8},${y - s * 1.15} ${x - s * 0.18},${y - s * 0.7}`);
  o += poly(`${x + s * 0.5},${y - s * 0.5} ${x + s * 0.8},${y - s * 1.15} ${x + s * 0.18},${y - s * 0.7}`);
  o += c(x - s * 0.26, y - s * 0.18, s * 0.1) + c(x + s * 0.26, y - s * 0.18, s * 0.1);
  o += e(x, y + s * 0.02, s * 0.1, s * 0.07);
  o += p(`M ${x - s * 0.16} ${y + s * 0.2} Q ${x} ${y + s * 0.34} ${x + s * 0.16} ${y + s * 0.2}`);
  for (const side of [-1, 1]) {
    o += line(x + side * s * 0.12, y + s * 0.02, x + side * s * 0.65, y - s * 0.04, SF);
    o += line(x + side * s * 0.12, y + s * 0.08, x + side * s * 0.68, y + s * 0.1, SF);
    o += line(x + side * s * 0.12, y + s * 0.14, x + side * s * 0.64, y + s * 0.26, SF);
  }
  o += p(`M ${x + s * 0.65} ${y + s * 0.45} Q ${x + s * 1.35} ${y + s * 0.15} ${x + s * 1.4} ${y - s * 0.25}`);
  o += e(x - s * 0.12, y + s * 0.32, s * 0.18, s * 0.14, SF);
  o += e(x + s * 0.18, y + s * 0.36, s * 0.16, s * 0.12, SF);
  return o;
}

function dog(x, y, s) {
  let o = e(x, y + s * 0.35, s * 0.85, s * 0.6);
  o += e(x + s * 0.5, y - s * 0.3, s * 0.48, s * 0.42);
  o += e(x + s * 0.12, y - s * 0.5, s * 0.2, s * 0.36);
  o += e(x + s * 0.8, y - s * 0.4, s * 0.18, s * 0.34);
  o += c(x + s * 0.38, y - s * 0.35, s * 0.07) + c(x + s * 0.65, y - s * 0.35, s * 0.07);
  o += e(x + s * 0.52, y - s * 0.12, s * 0.16, s * 0.1);
  o += p(`M ${x - s * 0.8} ${y + s * 0.15} Q ${x - s * 1.25} ${y - s * 0.25} ${x - s * 1.05} ${y - s * 0.45}`);
  o += c(x - s * 0.3, y + s * 0.9, s * 0.16) + c(x + s * 0.1, y + s * 0.9, s * 0.16);
  o += c(x + s * 0.4, y + s * 0.88, s * 0.16) + c(x + s * 0.68, y + s * 0.85, s * 0.14);
  return o;
}

function bird(x, y, s) {
  let o = e(x, y, s * 0.65, s * 0.45);
  o += c(x + s * 0.7, y - s * 0.18, s * 0.28);
  o += c(x + s * 0.82, y - s * 0.25, s * 0.06);
  o += p(`M ${x + s} ${y - s * 0.12} L ${x + s * 1.35} ${y} L ${x + s} ${y + s * 0.06} Z`);
  o += p(`M ${x - s * 0.1} ${y} Q ${x - s * 0.15} ${y - s * 0.75} ${x + s * 0.4} ${y - s * 0.2}`);
  o += p(`M ${x - s * 0.1} ${y + s * 0.05} Q ${x - s * 0.3} ${y + s * 0.5} ${x + s * 0.15} ${y + s * 0.3}`);
  for (let i = 0; i < 4; i++) {
    o += line(x - s * 0.25 + i * s * 0.12, y - s * 0.1, x - s * 0.15 + i * s * 0.12, y + s * 0.22, SF);
  }
  return o;
}

function car(x, y, s) {
  let o = r(x - s, y - s * 0.18, s * 2, s * 0.6, 14);
  o += p(
    `M ${x - s * 0.6} ${y - s * 0.18} L ${x - s * 0.28} ${y - s * 0.7} L ${x + s * 0.38} ${y - s * 0.7} L ${x + s * 0.8} ${y - s * 0.18}`,
  );
  o += r(x - s * 0.48, y - s * 0.58, s * 0.3, s * 0.3, 4);
  o += r(x + s * 0.05, y - s * 0.58, s * 0.35, s * 0.3, 4);
  o += c(x - s * 0.5, y + s * 0.48, s * 0.26) + c(x - s * 0.5, y + s * 0.48, s * 0.1, SF);
  o += c(x + s * 0.5, y + s * 0.48, s * 0.26) + c(x + s * 0.5, y + s * 0.48, s * 0.1, SF);
  return o;
}

function boat(x, y, s) {
  return (
    p(
      `M ${x - s} ${y} L ${x - s * 0.7} ${y + s * 0.48} L ${x + s * 0.7} ${y + s * 0.48} L ${x + s} ${y} Z`,
    ) +
    line(x, y, x, y - s * 1.05) +
    poly(`${x},${y - s * 1.05} ${x},${y - s * 0.08} ${x + s * 0.6},${y - s * 0.12}`)
  );
}

function balloon(x, y, s) {
  return (
    e(x, y, s * 0.65, s) +
    p(`M ${x} ${y + s} Q ${x - 6} ${y + s * 1.35} ${x} ${y + s * 1.7}`) +
    line(x, y + s * 1.7, x + 4, y + s * 2.3)
  );
}

function moon(x, y, s) {
  return p(
    `M ${x + s * 0.3} ${y - s * 0.8} A ${s} ${s} 0 1 0 ${x + s * 0.3} ${y + s * 0.8} A ${s * 0.65} ${s * 0.65} 0 1 1 ${x + s * 0.3} ${y - s * 0.8} Z`,
  );
}

function fishSchool(x, y, s) {
  let o = "";
  const pos = [
    [0, 0],
    [-1.1, 0.45],
    [1.0, 0.4],
    [-0.45, -0.65],
    [0.65, -0.6],
    [-1.4, -0.15],
    [1.4, 0.05],
  ];
  for (const [dx, dy] of pos) {
    const fx = x + dx * s;
    const fy = y + dy * s;
    const sc = s * 0.32;
    o += e(fx, fy, sc, sc * 0.5);
    o += poly(`${fx + sc},${fy} ${fx + sc * 1.45},${fy - sc * 0.35} ${fx + sc * 1.45},${fy + sc * 0.35}`);
    o += c(fx - sc * 0.35, fy - sc * 0.08, sc * 0.07);
  }
  return o;
}

function zig(y, amp = 14) {
  let d = `M 60 ${y}`;
  for (let x = 60; x <= W - 60; x += 26) d += ` L ${x + 13} ${y - amp} L ${x + 26} ${y}`;
  return p(d, SF);
}

/** 100 elaborate page builders */
function pages() {
  const out = [];
  const add = (category, titlePt, draw) => out.push({ category, titlePt, draw });

  add("scenes", "Jardim da festa", () => {
    let o = frame() + sun(150, 170, 46, 14) + cloud(520, 190, 40) + cloud(640, 240, 28);
    o += grass(CY + 320, 22) + tree(CX - 220, CY + 320, 190) + tree(CX + 230, CY + 330, 160);
    o += house(CX + 10, CY + 200, 150) + cat(CX - 90, CY + 240, 42) + dog(CX + 110, CY + 250, 40);
    o += flower(CX - 150, CY + 285, 6, 26, 8) + flower(CX - 50, CY + 295, 5, 22, 7);
    o += flower(CX + 170, CY + 290, 7, 24, 8) + bird(CX - 170, CY - 50, 34) + bird(CX + 190, CY - 90, 28);
    return o;
  });

  add("scenes", "Castelo encantado", () => {
    let o = frame() + sun(620, 160, 40, 12) + cloud(180, 200, 34) + grass(CY + 340, 18);
    o += castle(CX, CY + 320, 270) + tree(CX - 260, CY + 340, 145);
    o += flower(CX - 180, CY + 300, 6, 20, 6) + flower(CX + 200, CY + 310, 5, 18, 5);
    o += star(150, 280, 16) + star(200, 320, 11) + star(650, 300, 14) + bird(CX + 210, CY - 110, 30);
    return o;
  });

  add("scenes", "Parque na cidade", () => {
    let o = frame();
    o += r(90, CY - 70, 85, 270, 4) + r(195, CY - 150, 75, 350, 4) + r(295, CY - 30, 95, 230, 4);
    o += r(108, CY - 10, 22, 32, 2) + r(212, CY - 90, 22, 32, 2) + r(315, CY + 30, 22, 32, 2);
    o += sun(650, 150, 36, 10) + tree(CX + 180, CY + 300, 155) + grass(CY + 300, 14);
    o += dog(CX + 30, CY + 235, 38) + car(CX - 90, CY + 190, 68) + cloud(500, 215, 30);
    return o;
  });

  add("space", "Aventura espacial", () => {
    let o = frame();
    for (let i = 0; i < 18; i++) {
      o += star(90 + (i * 97) % 620, 120 + (i * 73) % 400, 7 + (i % 4) * 3, 5 + (i % 3));
    }
    o += c(CX - 120, CY - 40, 68) + e(CX - 120, CY - 40, 108, 26, SF);
    o += c(CX - 140, CY - 18, 11, SF) + c(CX - 100, CY - 48, 7, SF);
    o += p(
      `M ${CX + 40} ${CY - 150} Q ${CX + 115} ${CY - 30} ${CX + 95} ${CY + 75} L ${CX + 40} ${CY + 75} Q ${CX + 25} ${CY - 30} ${CX + 40} ${CY - 150} Z`,
    );
    o += c(CX + 68, CY - 35, 20);
    o += poly(`${CX + 40},${CY + 35} ${CX},${CY + 95} ${CX + 40},${CY + 75}`);
    o += poly(`${CX + 95},${CY + 35} ${CX + 135},${CY + 95} ${CX + 95},${CY + 75}`);
    o += e(CX + 155, CY + 175, 85, 28) + e(CX + 155, CY + 152, 42, 26);
    o += c(CX + 125, CY + 175, 5) + c(CX + 155, CY + 180, 5) + c(CX + 185, CY + 175, 5);
    o += moon(200, CY + 250, 48);
    return o;
  });

  add("food", "Festa de aniversario", () => {
    let o = frame() + e(CX, CY + 155, 250, 48);
    o += r(CX - 95, CY - 35, 190, 115, 10) + e(CX, CY - 35, 95, 26);
    o += c(CX - 48, CY - 68, 20) + c(CX, CY - 88, 24) + c(CX + 48, CY - 68, 20);
    o += line(CX, CY - 108, CX, CY - 145) + star(CX, CY - 155, 12);
    o += c(CX - 155, CY + 35, 52) + c(CX - 155, CY + 35, 20);
    o += poly(`${CX + 135},${CY - 25} ${CX + 210},${CY + 95} ${CX + 60},${CY + 95}`);
    o += balloon(CX - 200, CY - 170, 32) + balloon(CX - 120, CY - 210, 28) + balloon(CX + 175, CY - 190, 30);
    o += zig(CY + 275, 13);
    return o;
  });

  add("scenes", "Fazenda completa", () => {
    let o = frame() + sun(620, 170, 44, 12) + cloud(200, 190, 36) + grass(CY + 330, 18);
    o += house(CX - 160, CY + 200, 165) + tree(CX + 200, CY + 330, 175);
    o += e(CX + 40, CY + 248, 52, 36) + c(CX + 72, CY + 228, 26) + e(CX + 95, CY + 232, 14, 7);
    o += cat(CX - 40, CY + 275, 36) + flower(CX + 120, CY + 298, 5, 18, 5);
    o += r(CX + 215, CY + 175, 85, 65, 5) + line(CX + 215, CY + 208, CX + 300, CY + 208, SF);
    return o;
  });

  add("nature", "Floresta tropical", () => {
    let o = frame();
    o += tree(CX - 200, CY + 340, 250) + tree(CX, CY + 350, 290) + tree(CX + 205, CY + 340, 230);
    o += bird(CX - 100, CY - 75, 38) + bird(CX + 135, CY - 35, 32);
    o += e(CX + 35, CY + 175, 65, 38);
    for (let i = 0; i < 5; i++) o += flower(120 + i * 130, CY + 300, 5 + (i % 3), 20, 6);
    o += cloud(180, 160, 28) + cloud(550, 180, 32) + zig(CY + 360, 9);
    return o;
  });

  add("scenes", "Parquinho", () => {
    let o = frame() + sun(140, 160, 40, 12) + grass(CY + 335, 16);
    o += p(`M ${CX - 175} ${CY + 195} L ${CX - 175} ${CY - 35} L ${CX + 175} ${CY - 35} L ${CX + 175} ${CY + 195}`);
    o += line(CX - 175, CY - 35, CX, CY + 75) + line(CX + 175, CY - 35, CX, CY + 75);
    o += c(CX, CY + 95, 32) + e(CX - 215, CY + 115, 46, 65) + line(CX - 215, CY + 180, CX - 215, CY + 275);
    o += r(CX + 155, CY + 75, 115, 16, 4);
    o += line(CX + 168, CY + 91, CX + 168, CY + 275) + line(CX + 255, CY + 91, CX + 255, CY + 275);
    o += cat(CX - 35, CY + 275, 38) + cloud(520, 200, 34);
    return o;
  });

  add("food", "Cozinha alegre", () => {
    let o = frame() + r(100, CY - 95, 270, 310, 8);
    o += r(128, CY - 35, 85, 65, 4);
    o += line(170, CY - 35, 170, CY + 30, SF) + line(128, CY, 213, CY, SF);
    o += r(235, CY - 15, 95, 85, 4) + c(275, CY + 28, 7, SF);
    o += e(CX + 115, CY + 40, 85, 28) + c(CX + 75, CY - 15, 38);
    o += p(`M ${CX + 75} ${CY - 52} Q ${CX + 90} ${CY - 95} ${CX + 115} ${CY - 105}`);
    o += e(CX + 110, CY - 85, 20, 9);
    o += c(CX + 155, CY + 95, 32) + c(CX + 195, CY + 85, 26);
    o += star(CX + 195, CY - 155, 18) + zig(CY + 275, 11);
    return o;
  });

  add("nature", "Ondas do mar", () => {
    let o = frame() + sun(620, 160, 48, 14);
    for (let i = 0; i < 4; i++) {
      const y = CY - 35 + i * 68;
      o += p(`M 80 ${y} Q 200 ${y - 36} 350 ${y} Q 500 ${y + 36} 700 ${y}`, i % 2 ? S : SF);
    }
    o += p(
      `M ${CX - 35} ${CY + 35} Q ${CX + 35} ${CY - 35} ${CX + 115} ${CY + 18} Q ${CX + 150} ${CY + 38} ${CX + 125} ${CY + 55} Q ${CX} ${CY + 85} ${CX - 35} ${CY + 35} Z`,
    );
    o += star(CX - 155, CY + 195, 48, 5) + boat(CX - 95, CY - 95, 52) + cloud(180, 200, 32);
    return o;
  });

  add("scenes", "Banda musical", () => {
    let o = frame();
    o += e(CX, CY + 35, 75, 105) + c(CX, CY - 85, 50);
    o += c(CX - 16, CY - 95, 7) + c(CX + 16, CY - 95, 7);
    o += p(`M ${CX - 18} ${CY - 70} Q ${CX} ${CY - 55} ${CX + 18} ${CY - 70}`);
    o += r(CX - 95, CY - 15, 36, 85, 10) + r(CX + 58, CY - 15, 36, 85, 10);
    o += e(CX - 135, CY + 115, 46, 32) + c(CX - 135, CY + 115, 16);
    o += line(CX - 135, CY + 82, CX - 135, CY + 18);
    o += p(`M ${CX - 135} ${CY + 18} Q ${CX - 95} ${CY - 8} ${CX - 78} ${CY + 28}`);
    o += e(CX + 155, CY + 35, 32, 65) + line(CX + 187, CY - 18, CX + 187, CY + 95);
    o += e(CX + 200, CY - 28, 22, 16);
    o += balloon(150, 195, 26) + balloon(215, 165, 22) + balloon(600, 185, 28);
    o += star(CX, CY + 275, 36) + star(CX - 95, CY + 295, 20) + star(CX + 95, CY + 295, 20);
    return o;
  });

  add("animals", "Dinossauro no campo", () => {
    let o = frame();
    o += e(CX - 35, CY + 35, 130, 75);
    o += e(CX + 115, CY - 35, 50, 42);
    o += p(`M ${CX + 95} ${CY - 65} Q ${CX + 75} ${CY - 130} ${CX + 35} ${CY - 112}`);
    o += c(CX + 132, CY - 45, 7);
    o += p(`M ${CX + 150} ${CY - 28} L ${CX + 188} ${CY - 18} L ${CX + 150} ${CY - 8} Z`);
    o += p(`M ${CX - 150} ${CY + 18} Q ${CX - 245} ${CY + 75} ${CX - 210} ${CY + 130}`);
    for (let i = 0; i < 5; i++) {
      o += poly(
        `${CX - 75 + i * 38},${CY - 28} ${CX - 55 + i * 38},${CY - 75} ${CX - 35 + i * 38},${CY - 28}`,
      );
    }
    o += line(CX - 75, CY + 105, CX - 85, CY + 190);
    o += line(CX - 15, CY + 115, CX - 5, CY + 200);
    o += line(CX + 40, CY + 105, CX + 48, CY + 190);
    o += line(CX + 85, CY + 95, CX + 105, CY + 180);
    o += grass(CY + 270, 14) + sun(150, 180, 38, 10) + tree(CX + 215, CY + 270, 135);
    return o;
  });

  add("scenes", "Robo amigo", () => {
    let o = frame();
    o += r(CX - 65, CY - 35, 130, 170, 14) + r(CX - 52, CY - 120, 104, 85, 12);
    o += c(CX - 22, CY - 92, 12) + c(CX + 22, CY - 92, 12);
    o += c(CX - 22, CY - 92, 4) + c(CX + 22, CY - 92, 4);
    o += r(CX - 28, CY - 65, 56, 14, 3);
    o += line(CX, CY - 120, CX, CY - 158) + c(CX, CY - 168, 10);
    o += r(CX - 105, CY - 8, 36, 95, 9) + r(CX + 68, CY - 8, 36, 95, 9);
    o += r(CX - 48, CY + 135, 36, 65, 7) + r(CX + 10, CY + 135, 36, 65, 7);
    o += c(CX - 18, CY + 18, 10, SF) + c(CX + 18, CY + 18, 10, SF) + c(CX, CY + 52, 14, SF);
    o += star(150, 195, 20) + star(620, 235, 16) + zig(CY + 295, 11);
    return o;
  });

  add("animals", "Sereia no oceano", () => {
    let o = frame();
    for (let i = 0; i < 3; i++) {
      o += p(
        `M 80 ${CY + 95 + i * 48} Q 250 ${CY + 55 + i * 48} 400 ${CY + 95 + i * 48} Q 550 ${CY + 135 + i * 48} 700 ${CY + 95 + i * 48}`,
        SF,
      );
    }
    o += e(CX, CY - 35, 50, 65) + c(CX, CY - 120, 44);
    o += c(CX - 14, CY - 128, 5) + c(CX + 14, CY - 128, 5);
    o += p(`M ${CX - 14} ${CY - 105} Q ${CX} ${CY - 95} ${CX + 14} ${CY - 105}`);
    o += p(`M ${CX - 36} ${CY - 148} Q ${CX - 75} ${CY - 185} ${CX - 18} ${CY - 175}`);
    o += p(`M ${CX + 36} ${CY - 148} Q ${CX + 75} ${CY - 185} ${CX + 18} ${CY - 175}`);
    o += p(
      `M ${CX - 36} ${CY + 18} Q ${CX - 75} ${CY + 150} ${CX} ${CY + 188} Q ${CX + 75} ${CY + 150} ${CX + 36} ${CY + 18}`,
    );
    o += poly(`${CX},${CY + 188} ${CX - 45},${CY + 245} ${CX},${CY + 225} ${CX + 45},${CY + 245}`);
    o += star(CX - 170, CY + 75, 36, 5) + fishSchool(CX + 170, CY + 35, 48);
    return o;
  });

  add("vehicles", "Estacao de trem", () => {
    let o = frame() + r(80, CY + 75, W - 160, 22, 4) + line(80, CY + 115, W - 80, CY + 115);
    for (let x = 100; x < W - 100; x += 48) o += line(x, CY + 97, x + 18, CY + 115, SF);
    o += r(CX - 195, CY - 35, 115, 95, 8) + r(CX - 65, CY - 18, 125, 78, 8) + r(CX + 70, CY - 18, 125, 78, 8);
    o += r(CX - 180, CY - 18, 48, 38, 4);
    o += c(CX - 165, CY + 68, 20) + c(CX - 105, CY + 68, 20);
    o += c(CX - 5, CY + 68, 20) + c(CX + 50, CY + 68, 20);
    o += c(CX + 125, CY + 68, 20) + c(CX + 175, CY + 68, 20);
    o += cloud(200, 180, 34) + sun(620, 160, 38, 10) + house(CX + 200, CY - 80, 85);
    return o;
  });

  add("food", "Loja de sorvete", () => {
    let o = frame() + house(CX, CY + 115, 210);
    o += poly(`${CX - 48},${CY - 75} ${CX + 48},${CY - 75} ${CX},${CY + 35}`);
    o += c(CX - 22, CY - 105, 26) + c(CX + 22, CY - 105, 26) + c(CX, CY - 138, 28);
    o += sun(150, 170, 38, 10) + flower(CX - 195, CY + 245, 6, 26, 8) + flower(CX + 195, CY + 255, 5, 24, 7);
    o += cat(CX - 135, CY + 215, 38) + cloud(550, 200, 32) + zig(CY + 315, 11);
    return o;
  });

  add("scenes", "Biblioteca", () => {
    let o = frame() + r(100, CY - 115, 595, 310, 8);
    for (let row = 0; row < 3; row++) {
      const y = CY - 85 + row * 95;
      o += line(120, y + 75, 675, y + 75);
      for (let i = 0; i < 8; i++) {
        const x = 140 + i * 62;
        const hh = 48 + (i % 3) * 8;
        o += r(x, y + 75 - hh, 38, hh, 3);
        o += line(x + 6, y + 75 - hh + 8, x + 30, y + 75 - hh + 8, SF);
      }
    }
    o += cat(CX, CY + 275, 48) + star(150, 160, 14) + star(620, 175, 12);
    return o;
  });

  add("scenes", "Circo", () => {
    let o = frame();
    o += poly(`${CX},${CY - 210} ${CX - 210},${CY + 95} ${CX + 210},${CY + 95}`);
    o += line(CX, CY - 210, CX, CY + 95);
    for (let i = 1; i < 5; i++) o += line(CX - 210 + i * 84, CY + 95, CX, CY - 210, SF);
    o += c(CX, CY - 228, 16);
    o += line(CX, CY - 245, CX, CY - 210) + poly(`${CX},${CY - 245} ${CX + 38},${CY - 228} ${CX},${CY - 212}`);
    o += e(CX - 95, CY + 175, 36, 50) + c(CX - 95, CY + 108, 26);
    o += e(CX + 75, CY + 185, 46, 36) + c(CX + 75, CY + 135, 22);
    o += star(150, 195, 18) + star(620, 215, 16);
    o += balloon(175, CY - 35, 24) + balloon(595, CY - 55, 26);
    return o;
  });

  add("scenes", "Vila de inverno", () => {
    let o = frame() + house(CX - 155, CY + 155, 135) + house(CX + 135, CY + 175, 150);
    o += tree(CX, CY + 275, 150);
    for (let i = 0; i < 18; i++) {
      o += star(100 + (i * 83) % 600, 140 + (i * 47) % 190, 4 + (i % 3), 4);
    }
    o += p(`M 80 ${CY + 275} Q 200 ${CY + 245} 400 ${CY + 285} Q 600 ${CY + 245} 720 ${CY + 295}`, SF);
    o += e(CX - 35, CY + 295, 32, 20) + c(CX - 35, CY + 275, 16) + moon(620, 175, 42);
    return o;
  });

  add("scenes", "Dia de esportes", () => {
    let o = frame() + sun(150, 160, 38, 10) + grass(CY + 315, 14);
    o += c(CX - 115, CY + 35, 65) + poly(starPts(CX - 115, CY + 35, 5, 26, 26));
    o += r(CX + 40, CY - 115, 18, 150, 3) + e(CX + 49, CY - 125, 42, 14);
    o += p(`M ${CX + 7} ${CY - 125} L ${CX - 8} ${CY - 5} L ${CX + 105} ${CY - 5} L ${CX + 90} ${CY - 125}`);
    o += c(CX + 48, CY + 75, 32);
    o += e(CX + 175, CY + 95, 46, 65) + e(CX + 175, CY + 95, 28, 42, SF);
    o += r(CX + 160, CY + 160, 28, 95, 5) + dog(CX - 35, CY + 245, 38) + cloud(500, 200, 32);
    return o;
  });

  add("food", "Terra doce", () => {
    let o = frame();
    o += c(CX - 155, CY - 35, 65) + c(CX - 155, CY - 35, 32, SF);
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      o += c(CX - 155 + Math.cos(a) * 45, CY - 35 + Math.sin(a) * 45, 9, SF);
    }
    o += r(CX - 28, CY - 75, 56, 190, 7) + e(CX, CY - 95, 75, 36);
    o += c(CX - 36, CY - 122, 22) + c(CX + 36, CY - 122, 22) + c(CX, CY - 150, 25);
    o += poly(`${CX + 115},${CY - 35} ${CX + 190},${CY + 115} ${CX + 40},${CY + 115}`);
    o += flower(CX - 195, CY + 215, 8, 36, 12) + flower(CX + 195, CY + 230, 7, 32, 10);
    o += zig(CY + 295, 14) + star(150, 175, 16) + star(620, 195, 14);
    return o;
  });

  add("animals", "Aquario elaborado", () => {
    let o = frame() + zig(175, 10) + fishSchool(CX, CY - 35, 85) + e(CX, CY + 275, 270, 48, SF);
    for (let i = 0; i < 7; i++) {
      const x = 120 + i * 88;
      o += p(`M ${x} ${CY + 275} Q ${x - 8} ${CY + 195} ${x} ${CY + 135} Q ${x + 12} ${CY + 195} ${x} ${CY + 275}`);
      o += c(x, CY + 125, 7, SF);
    }
    o += c(175, CY - 195, 36) + star(175, CY - 195, 16, 8);
    o += c(595, CY - 155, 26) + star(595, CY - 155, 11, 6);
    for (let i = 0; i < 8; i++) o += c(140 + i * 68, CY + 75 + (i % 3) * 28, 3 + (i % 3), SF);
    return o;
  });

  for (let i = 0; i < 12; i++) {
    add("shapes", `Mandala ${i + 1}`, () => {
      let o = frame() + mandala(CX, CY - 15, 4 + (i % 4));
      o += zig(CY + 315, 9 + (i % 5));
      o += flower(120, 155, 5 + (i % 3), 22, 7) + flower(670, 175, 6, 20, 6);
      return o;
    });
  }

  const animalPack = [
    ["Gato detalhado", cat],
    ["Cachorro detalhado", dog],
    ["Passaro detalhado", bird],
  ];
  for (const [name, fn] of animalPack) {
    add("animals", name, () => frame() + fn(CX, CY - 15, 125) + flower(140, CY + 255, 6, 28, 9) + flower(650, CY + 265, 5, 26, 8));
    add("animals", `${name} no jardim`, () =>
      frame() + sun(150, 170, 38, 12) + grass(CY + 315, 14) + fn(CX, CY - 35, 95) + tree(CX + 215, CY + 315, 145) + flower(CX - 195, CY + 275, 6, 24, 7),
    );
    add("animals", `${name} e amigo`, () =>
      frame() + fn(CX - 105, CY, 80) + fn(CX + 125, CY + 28, 60) + cloud(500, 175, 32) + star(160, 195, 14),
    );
    add("animals", `Retrato: ${name}`, () => frame() + c(CX, CY, 190, SF) + fn(CX, CY + 8, 105) + zig(CY + 295, 11));
  }

  for (let i = 0; i < 8; i++) {
    add("vehicles", `Veiculo elaborado ${i + 1}`, () => {
      let o = frame() + sun(140 + i * 8, 160, 36, 10) + grass(CY + 295, 12);
      o += car(CX - 30 + (i % 3) * 16, CY + 35, 88 + (i % 4) * 4);
      if (i % 2 === 0) o += house(CX + 175, CY + 75, 95);
      if (i % 3 === 0) o += cloud(520, 195, 30);
      if (i % 2 === 1) o += tree(CX - 215, CY + 295, 135);
      o += cat(CX + 75, CY + 195, 28 + (i % 3) * 3);
      return o;
    });
  }

  for (let i = 0; i < 10; i++) {
    add("nature", `Natureza elaborada ${i + 1}`, () => {
      let o = frame() + sun(120 + i * 10, 160, 40, 12 + (i % 3));
      o += tree(CX - 155 + (i % 3) * 25, CY + 325, 175 + i * 4);
      o += tree(CX + 175, CY + 335, 145 + i * 3) + grass(CY + 335, 16);
      for (let f = 0; f < 4; f++) o += flower(155 + f * 135, CY + 275 + (f % 2) * 12, 5 + (f % 3), 22, 7);
      if (i % 2 === 0) o += cloud(500, 195, 34);
      if (i % 3 === 0) o += bird(CX, CY - 75, 36);
      if (i % 4 === 0) o += mandala(CX, CY - 35, 3);
      return o;
    });
  }

  for (let i = 0; i < 8; i++) {
    add("space", `Espaco elaborado ${i + 1}`, () => {
      let o = frame();
      for (let s = 0; s < 14; s++) {
        o += star(90 + (s * 101 + i * 17) % 620, 130 + (s * 67) % 370, 6 + (s % 4) * 2, 5);
      }
      o += c(CX - 95 + i * 6, CY - 15, 52 + i * 2);
      o += e(CX - 95 + i * 6, CY - 15, 90, 22, SF);
      if (i % 2 === 0) {
        o += p(
          `M ${CX + 55} ${CY - 130} Q ${CX + 120} ${CY - 15} ${CX + 100} ${CY + 95} L ${CX + 48} ${CY + 95} Q ${CX + 38} ${CY - 15} ${CX + 55} ${CY - 130} Z`,
        );
        o += c(CX + 78, CY - 25, 16);
      } else {
        o += e(CX + 115, CY + 55, 75, 26) + e(CX + 115, CY + 38, 38, 22);
      }
      o += moon(175, 195, 32 + (i % 3) * 4);
      return o;
    });
  }

  for (let i = 0; i < 8; i++) {
    add("food", `Lanche elaborado ${i + 1}`, () => {
      let o = frame() + e(CX, CY + 170, 210, 42);
      o += r(CX - 85, CY - 35, 170, 105, 10) + e(CX, CY - 35, 85, 22);
      o += c(CX - 42, CY - 68, 18) + c(CX, CY - 88, 22) + c(CX + 42, CY - 68, 18);
      o += c(CX - 150, CY + 35, 46) + c(CX - 150, CY + 35, 18, SF);
      o += poly(`${CX + 130},${CY - 55} ${CX + 195},${CY + 75} ${CX + 65},${CY + 75}`);
      o += flower(140, CY + 250, 5, 20, 6) + flower(650, CY + 260, 6, 18, 5);
      o += star(CX + 15, CY - 130, 12);
      if (i % 2 === 0) o += balloon(175, 175, 24);
      return o;
    });
  }

  // Fill to exactly 100 with scene variations
  const fillers = [
    ["scenes", "Cena elaborada A", () => frame() + gardenLike(0)],
    ["scenes", "Cena elaborada B", () => frame() + gardenLike(1)],
    ["scenes", "Cena elaborada C", () => frame() + gardenLike(2)],
    ["scenes", "Cena elaborada D", () => frame() + gardenLike(3)],
    ["scenes", "Cena elaborada E", () => frame() + gardenLike(4)],
    ["scenes", "Cena elaborada F", () => frame() + gardenLike(5)],
    ["animals", "Zoo elaborado", () => frame() + zoo()],
    ["nature", "Jardim mandala", () => frame() + mandala(CX, CY - 40, 5) + grass(CY + 320, 14) + flower(150, CY + 280, 6, 24, 8) + flower(640, CY + 290, 5, 22, 7)],
  ];

  function gardenLike(seed) {
    let o = sun(140 + seed * 15, 165, 40, 12) + grass(CY + 320, 16);
    o += house(CX - 40 + seed * 8, CY + 200, 140 + seed * 5);
    o += tree(CX + 200, CY + 320, 150 + seed * 6);
    o += cat(CX - 100, CY + 250, 36 + seed) + flower(CX - 180, CY + 290, 5 + (seed % 3), 22, 7);
    if (seed % 2 === 0) o += cloud(520, 200, 30);
    if (seed % 3 === 0) o += bird(CX + 160, CY - 60, 30);
    o += star(100 + seed * 40, 280, 12);
    return o;
  }

  function zoo() {
    let o = sun(150, 170, 40, 10) + grass(CY + 330, 14);
    o += cat(CX - 160, CY + 40, 55) + dog(CX + 40, CY + 50, 55) + bird(CX + 180, CY - 40, 45);
    o += tree(CX - 220, CY + 330, 140) + tree(CX + 230, CY + 340, 130);
    o += r(CX - 100, CY + 180, 200, 90, 8);
    o += e(CX, CY + 200, 40, 28) + c(CX + 30, CY + 185, 20);
    return o;
  }

  for (const [catName, title, draw] of fillers) {
    if (out.length >= 100) break;
    add(catName, title, draw);
  }

  // Safety pad
  let n = 1;
  while (out.length < 100) {
    add("scenes", `Cena elaborada extra ${n}`, () => frame() + gardenLike(n % 6) + mandala(CX - 180, CY - 120, 2));
    n++;
  }

  return out.slice(0, 100);
}

function buildCatalogTs(entries) {
  const lines = [
    "export type ColorirCategory =",
    '  | "animals"',
    '  | "vehicles"',
    '  | "nature"',
    '  | "letters"',
    '  | "numbers"',
    '  | "shapes"',
    '  | "scenes"',
    '  | "food"',
    '  | "space";',
    "",
    "export type ColorirPage = {",
    "  id: string;",
    "  file: string;",
    "  titlePt: string;",
    "  category: ColorirCategory;",
    '  license: "CC0";',
    "  attribution: string;",
    "  printFriendly: boolean;",
    "};",
    "",
    "export const colorirPages: ColorirPage[] = [",
  ];
  for (const e of entries) {
    lines.push(
      `  { id: ${JSON.stringify(e.id)}, file: ${JSON.stringify(e.file)}, titlePt: ${JSON.stringify(e.titlePt)}, category: ${JSON.stringify(e.category)}, license: "CC0", attribution: "Sem Talento Studio", printFriendly: true },`,
    );
  }
  lines.push("];", "");
  lines.push("export const colorirCategories: ColorirCategory[] = [");
  lines.push(
    '  "animals", "vehicles", "nature", "letters", "numbers", "shapes", "scenes", "food", "space",',
  );
  lines.push("];", "");
  return lines.join("\n");
}

const existing = JSON.parse(fs.readFileSync(CATALOG_JSON, "utf8"));
const start = existing.length + 1;
const builders = pages();
if (builders.length !== 100) {
  console.error("Expected 100 builders, got", builders.length);
  process.exit(1);
}

fs.mkdirSync(PAGES_DIR, { recursive: true });
const added = [];
for (let i = 0; i < builders.length; i++) {
  const n = start + i;
  const id = `colorir-${String(n).padStart(3, "0")}`;
  const file = `/education/colorir/pages/${id}.svg`;
  const { category, titlePt, draw } = builders[i];
  fs.writeFileSync(path.join(PAGES_DIR, `${id}.svg`), wrap(draw()), "utf8");
  added.push({
    id,
    file,
    titlePt,
    category,
    license: "CC0",
    attribution: "Sem Talento Studio",
    printFriendly: true,
  });
}

const all = existing.concat(added);
fs.writeFileSync(CATALOG_TS, buildCatalogTs(all), "utf8");
fs.writeFileSync(CATALOG_JSON, JSON.stringify(all, null, 2), "utf8");

const size1 = fs.statSync(path.join(PAGES_DIR, "colorir-001.svg")).size;
const sizeNew = fs.statSync(path.join(PAGES_DIR, added[0].id + ".svg")).size;
console.log("Added", added.length, "elaborate CC0 pages");
console.log("Total", all.length);
console.log("Range", added[0].id, "..", added[added.length - 1].id);
console.log("Size compare colorir-001:", size1, "vs", added[0].id + ":", sizeNew);
console.log("Examples:", added.slice(0, 5).map((p) => p.titlePt).join(" | "));
