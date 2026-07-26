/**
 * Generates original CC0 SVG coloring pages + TypeScript catalog.
 * Run: node scripts/generate-colorir-pages.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "public", "education", "colorir", "pages");
const CATALOG_PATH = path.join(ROOT, "src", "data", "colorir-catalog.ts");

const VB_W = 794;
const VB_H = 1123;
const CX = VB_W / 2;
const CY = VB_H / 2;
const S = 'fill="none" stroke="#111" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const SF = 'fill="none" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"';

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function wrap(inner) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${VB_W}" height="${VB_H}">\n<rect width="${VB_W}" height="${VB_H}" fill="#fff"/>\n${inner}\n</svg>\n`;
}
function c(cx, cy, r, a = S) { return `<circle cx="${cx}" cy="${cy}" r="${r}" ${a}/>`; }
function e(cx, cy, rx, ry, a = S) { return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${a}/>`; }
function rect(x, y, w, h, rx = 0, a = S) { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${a}/>`; }
function p(d, a = S) { return `<path d="${d}" ${a}/>`; }
function poly(pts, a = S) { return `<polygon points="${pts}" ${a}/>`; }
function line(x1, y1, x2, y2, a = S) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${a}/>`; }
function g(content, t = "") { return t ? `<g transform="${t}">${content}</g>` : `<g>${content}</g>`; }

function starPts(cx, cy, spikes, outer, inner) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const ang = (Math.PI / spikes) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? outer : inner;
    pts.push(`${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`);
  }
  return pts.join(" ");
}
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
function tree(cx, baseY, h) {
  const trunkW = h * 0.12, trunkH = h * 0.35;
  return rect(cx - trunkW / 2, baseY - trunkH, trunkW, trunkH, 4) + c(cx, baseY - trunkH - h * 0.22, h * 0.28) + c(cx - h * 0.18, baseY - trunkH - h * 0.1, h * 0.2) + c(cx + h * 0.18, baseY - trunkH - h * 0.1, h * 0.2);
}
function sun(cx, cy, rSun, rays = 8) {
  let out = c(cx, cy, rSun);
  for (let i = 0; i < rays; i++) {
    const a = (Math.PI * 2 * i) / rays;
    out += line(cx + Math.cos(a) * (rSun + 12), cy + Math.sin(a) * (rSun + 12), cx + Math.cos(a) * (rSun + 36), cy + Math.sin(a) * (rSun + 36));
  }
  return out;
}
function cloud(cx, cy, s) {
  return e(cx, cy, s * 1.2, s * 0.7) + c(cx - s * 0.7, cy + s * 0.1, s * 0.55) + c(cx + s * 0.7, cy + s * 0.1, s * 0.5) + c(cx, cy - s * 0.35, s * 0.55);
}
function house(cx, baseY, w) {
  const h = w * 0.75, roof = w * 0.45;
  return rect(cx - w / 2, baseY - h, w, h, 4) + poly(`${cx - w / 2 - 20},${baseY - h} ${cx},${baseY - h - roof} ${cx + w / 2 + 20},${baseY - h}`) + rect(cx - w * 0.12, baseY - h * 0.45, w * 0.24, h * 0.45, 2) + rect(cx - w * 0.38, baseY - h * 0.72, w * 0.2, w * 0.18, 2) + rect(cx + w * 0.18, baseY - h * 0.72, w * 0.2, w * 0.18, 2);
}
function bubbleLetter(ch, cx, cy, size) {
  return `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" font-family="Arial Black, Arial, sans-serif" font-size="${size}" fill="none" stroke="#111" stroke-width="4" stroke-linejoin="round">${esc(ch)}</text>`;
}
function frameDecor(variant) {
  if (variant % 3 === 0) return rect(40, 40, VB_W - 80, VB_H - 80, 24, SF) + rect(55, 55, VB_W - 110, VB_H - 110, 18, SF);
  if (variant % 3 === 1) return c(70, 70, 18, SF) + c(VB_W - 70, 70, 18, SF) + c(70, VB_H - 70, 18, SF) + c(VB_W - 70, VB_H - 70, 18, SF);
  return line(50, 80, 120, 80, SF) + line(VB_W - 120, 80, VB_W - 50, 80, SF) + line(50, VB_H - 80, 120, VB_H - 80, SF) + line(VB_W - 120, VB_H - 80, VB_W - 50, VB_H - 80, SF);
}

function cat(cx, cy, s) {
  return e(cx, cy, s * 0.9, s * 0.75) + poly(`${cx - s * 0.7},${cy - s * 0.5} ${cx - s * 0.95},${cy - s * 1.15} ${cx - s * 0.25},${cy - s * 0.7}`) + poly(`${cx + s * 0.7},${cy - s * 0.5} ${cx + s * 0.95},${cy - s * 1.15} ${cx + s * 0.25},${cy - s * 0.7}`) + c(cx - s * 0.35, cy - s * 0.1, s * 0.1) + c(cx + s * 0.35, cy - s * 0.1, s * 0.1) + p(`M ${cx - s * 0.15} ${cy + s * 0.15} Q ${cx} ${cy + s * 0.35} ${cx + s * 0.15} ${cy + s * 0.15}`) + line(cx, cy + s * 0.05, cx, cy + s * 0.25) + line(cx - s * 0.9, cy + s * 0.15, cx - s * 1.5, cy - s * 0.1) + line(cx + s * 0.9, cy + s * 0.15, cx + s * 1.5, cy - s * 0.1);
}
function dog(cx, cy, s) {
  return e(cx, cy, s * 0.85, s * 0.7) + e(cx - s * 0.75, cy - s * 0.15, s * 0.28, s * 0.4) + e(cx + s * 0.75, cy - s * 0.15, s * 0.28, s * 0.4) + c(cx - s * 0.3, cy - s * 0.05, s * 0.1) + c(cx + s * 0.3, cy - s * 0.05, s * 0.1) + e(cx, cy + s * 0.25, s * 0.22, s * 0.16) + p(`M ${cx - s * 0.2} ${cy + s * 0.45} Q ${cx} ${cy + s * 0.6} ${cx + s * 0.2} ${cy + s * 0.45}`);
}
function fish(cx, cy, s) {
  return e(cx, cy, s, s * 0.55) + poly(`${cx + s},${cy} ${cx + s * 1.55},${cy - s * 0.45} ${cx + s * 1.55},${cy + s * 0.45}`) + c(cx - s * 0.45, cy - s * 0.12, s * 0.1) + p(`M ${cx - s * 0.1} ${cy + s * 0.05} Q ${cx + s * 0.2} ${cy + s * 0.25} ${cx + s * 0.5} ${cy}`);
}
function bird(cx, cy, s) {
  return e(cx, cy, s * 0.7, s * 0.5) + c(cx + s * 0.75, cy - s * 0.15, s * 0.32) + c(cx + s * 0.9, cy - s * 0.2, s * 0.07) + p(`M ${cx + s * 1.05} ${cy - s * 0.1} L ${cx + s * 1.4} ${cy} L ${cx + s * 1.05} ${cy + s * 0.05} Z`) + p(`M ${cx - s * 0.2} ${cy} Q ${cx - s * 0.1} ${cy - s * 0.7} ${cx + s * 0.4} ${cy - s * 0.2}`);
}
function butterfly(cx, cy, s) {
  return e(cx - s * 0.55, cy - s * 0.25, s * 0.45, s * 0.55) + e(cx + s * 0.55, cy - s * 0.25, s * 0.45, s * 0.55) + e(cx - s * 0.45, cy + s * 0.4, s * 0.35, s * 0.4) + e(cx + s * 0.45, cy + s * 0.4, s * 0.35, s * 0.4) + e(cx, cy, s * 0.12, s * 0.7) + line(cx, cy - s * 0.7, cx - s * 0.2, cy - s * 1.05) + line(cx, cy - s * 0.7, cx + s * 0.2, cy - s * 1.05);
}
function rabbit(cx, cy, s) {
  return e(cx, cy, s * 0.7, s * 0.65) + e(cx - s * 0.35, cy - s * 0.95, s * 0.18, s * 0.55) + e(cx + s * 0.35, cy - s * 0.95, s * 0.18, s * 0.55) + c(cx - s * 0.25, cy - s * 0.05, s * 0.09) + c(cx + s * 0.25, cy - s * 0.05, s * 0.09) + e(cx, cy + s * 0.2, s * 0.15, s * 0.1);
}
function elephant(cx, cy, s) {
  return e(cx, cy, s * 0.9, s * 0.7) + e(cx - s * 0.95, cy - s * 0.35, s * 0.35, s * 0.45) + e(cx + s * 0.95, cy - s * 0.35, s * 0.35, s * 0.45) + c(cx - s * 0.35, cy - s * 0.15, s * 0.1) + c(cx + s * 0.35, cy - s * 0.15, s * 0.1) + p(`M ${cx} ${cy + s * 0.2} Q ${cx - s * 0.1} ${cy + s * 1.1} ${cx + s * 0.25} ${cy + s * 1.2}`);
}
function turtle(cx, cy, s) {
  return e(cx, cy, s, s * 0.65) + c(cx, cy, s * 0.35) + line(cx - s * 0.35, cy, cx + s * 0.35, cy) + line(cx, cy - s * 0.35, cx, cy + s * 0.35) + e(cx + s * 1.15, cy - s * 0.1, s * 0.35, s * 0.28) + c(cx - s * 0.7, cy + s * 0.7, s * 0.2) + c(cx + s * 0.3, cy + s * 0.7, s * 0.2) + c(cx - s * 0.7, cy - s * 0.7, s * 0.2) + c(cx + s * 0.3, cy - s * 0.7, s * 0.2);
}
function frog(cx, cy, s) {
  return e(cx, cy, s * 0.9, s * 0.55) + c(cx - s * 0.45, cy - s * 0.45, s * 0.28) + c(cx + s * 0.45, cy - s * 0.45, s * 0.28) + c(cx - s * 0.45, cy - s * 0.45, s * 0.1) + c(cx + s * 0.45, cy - s * 0.45, s * 0.1) + e(cx - s * 1.05, cy + s * 0.35, s * 0.35, s * 0.18) + e(cx + s * 1.05, cy + s * 0.35, s * 0.35, s * 0.18);
}
function duck(cx, cy, s) {
  return e(cx, cy, s * 0.75, s * 0.5) + c(cx + s * 0.7, cy - s * 0.45, s * 0.35) + p(`M ${cx + s * 1.0} ${cy - s * 0.4} L ${cx + s * 1.55} ${cy - s * 0.35} L ${cx + s * 1.0} ${cy - s * 0.2} Z`) + c(cx + s * 0.8, cy - s * 0.5, s * 0.07);
}
function crab(cx, cy, s) {
  return e(cx, cy, s * 0.85, s * 0.5) + c(cx - s * 0.35, cy - s * 0.15, s * 0.12) + c(cx + s * 0.35, cy - s * 0.15, s * 0.12) + p(`M ${cx - s * 0.85} ${cy} Q ${cx - s * 1.4} ${cy - s * 0.6} ${cx - s * 1.2} ${cy - s * 0.9}`) + p(`M ${cx + s * 0.85} ${cy} Q ${cx + s * 1.4} ${cy - s * 0.6} ${cx + s * 1.2} ${cy - s * 0.9}`) + line(cx - s * 0.5, cy + s * 0.45, cx - s * 0.7, cy + s * 0.9) + line(cx + s * 0.5, cy + s * 0.45, cx + s * 0.7, cy + s * 0.9);
}
function dolphin(cx, cy, s) {
  return p(`M ${cx - s} ${cy} Q ${cx - s * 0.2} ${cy - s * 0.7} ${cx + s * 0.8} ${cy - s * 0.15} Q ${cx + s * 1.2} ${cy} ${cx + s * 0.9} ${cy + s * 0.25} Q ${cx} ${cy + s * 0.55} ${cx - s} ${cy} Z`) + p(`M ${cx - s * 0.1} ${cy - s * 0.4} L ${cx} ${cy - s * 0.95} L ${cx + s * 0.25} ${cy - s * 0.35}`) + c(cx + s * 0.55, cy - s * 0.15, s * 0.07);
}
function car(cx, cy, s) {
  return rect(cx - s, cy - s * 0.25, s * 2, s * 0.7, 18) + p(`M ${cx - s * 0.7} ${cy - s * 0.25} L ${cx - s * 0.35} ${cy - s * 0.75} L ${cx + s * 0.45} ${cy - s * 0.75} L ${cx + s * 0.85} ${cy - s * 0.25}`) + rect(cx - s * 0.55, cy - s * 0.65, s * 0.35, s * 0.32, 4) + rect(cx + s * 0.05, cy - s * 0.65, s * 0.4, s * 0.32, 4) + c(cx - s * 0.55, cy + s * 0.45, s * 0.28) + c(cx + s * 0.55, cy + s * 0.45, s * 0.28);
}
function truck(cx, cy, s) {
  return rect(cx - s * 1.1, cy - s * 0.55, s * 1.4, s * 0.95, 8) + rect(cx + s * 0.35, cy - s * 0.25, s * 0.75, s * 0.65, 8) + rect(cx + s * 0.5, cy - s * 0.55, s * 0.45, s * 0.3, 4) + c(cx - s * 0.7, cy + s * 0.45, s * 0.28) + c(cx + s * 0.15, cy + s * 0.45, s * 0.28) + c(cx + s * 0.75, cy + s * 0.45, s * 0.28);
}
function bus(cx, cy, s) {
  let out = rect(cx - s * 1.2, cy - s * 0.55, s * 2.4, s * 1.0, 14);
  for (let i = 0; i < 4; i++) out += rect(cx - s * 0.95 + i * s * 0.5, cy - s * 0.35, s * 0.35, s * 0.35, 4);
  return out + c(cx - s * 0.7, cy + s * 0.5, s * 0.28) + c(cx + s * 0.7, cy + s * 0.5, s * 0.28);
}
function bike(cx, cy, s) {
  return c(cx - s * 0.7, cy + s * 0.35, s * 0.4) + c(cx + s * 0.7, cy + s * 0.35, s * 0.4) + line(cx - s * 0.7, cy + s * 0.35, cx, cy - s * 0.15) + line(cx, cy - s * 0.15, cx + s * 0.7, cy + s * 0.35) + line(cx - s * 0.7, cy + s * 0.35, cx + s * 0.15, cy + s * 0.35) + line(cx, cy - s * 0.15, cx + s * 0.15, cy + s * 0.35) + line(cx + s * 0.15, cy + s * 0.35, cx + s * 0.55, cy - s * 0.35);
}
function plane(cx, cy, s) {
  return e(cx, cy, s * 1.2, s * 0.28) + poly(`${cx - s * 0.2},${cy} ${cx - s * 0.6},${cy - s * 0.85} ${cx + s * 0.1},${cy}`) + poly(`${cx - s * 0.2},${cy} ${cx - s * 0.6},${cy + s * 0.85} ${cx + s * 0.1},${cy}`) + poly(`${cx + s * 0.9},${cy} ${cx + s * 1.35},${cy - s * 0.35} ${cx + s * 1.15},${cy}`);
}
function boat(cx, cy, s) {
  return p(`M ${cx - s} ${cy} L ${cx - s * 0.7} ${cy + s * 0.55} L ${cx + s * 0.7} ${cy + s * 0.55} L ${cx + s} ${cy} Z`) + line(cx, cy, cx, cy - s * 1.1) + poly(`${cx},${cy - s * 1.1} ${cx},${cy - s * 0.1} ${cx + s * 0.7},${cy - s * 0.15}`);
}
function train(cx, cy, s) {
  return rect(cx - s * 1.1, cy - s * 0.5, s * 1.0, s * 0.9, 10) + rect(cx, cy - s * 0.35, s * 1.1, s * 0.75, 8) + rect(cx - s * 0.95, cy - s * 0.35, s * 0.4, s * 0.35, 4) + c(cx - s * 0.75, cy + s * 0.45, s * 0.22) + c(cx + s * 0.25, cy + s * 0.45, s * 0.22) + c(cx + s * 0.75, cy + s * 0.45, s * 0.22);
}
function rocket(cx, cy, s) {
  return p(`M ${cx} ${cy - s * 1.2} Q ${cx + s * 0.45} ${cy - s * 0.4} ${cx + s * 0.4} ${cy + s * 0.5} L ${cx - s * 0.4} ${cy + s * 0.5} Q ${cx - s * 0.45} ${cy - s * 0.4} ${cx} ${cy - s * 1.2} Z`) + c(cx, cy - s * 0.35, s * 0.18) + poly(`${cx - s * 0.4},${cy + s * 0.2} ${cx - s * 0.85},${cy + s * 0.55} ${cx - s * 0.4},${cy + s * 0.5}`) + poly(`${cx + s * 0.4},${cy + s * 0.2} ${cx + s * 0.85},${cy + s * 0.55} ${cx + s * 0.4},${cy + s * 0.5}`) + p(`M ${cx - s * 0.25} ${cy + s * 0.5} L ${cx} ${cy + s * 0.95} L ${cx + s * 0.25} ${cy + s * 0.5}`);
}
function helicopter(cx, cy, s) {
  return e(cx, cy, s * 0.7, s * 0.4) + rect(cx + s * 0.5, cy - s * 0.1, s * 0.9, s * 0.18, 6) + line(cx - s * 0.9, cy - s * 0.5, cx + s * 0.9, cy - s * 0.5) + line(cx, cy - s * 0.5, cx, cy - s * 0.15) + c(cx - s * 0.25, cy, s * 0.12);
}
function apple(cx, cy, s) {
  return p(`M ${cx} ${cy + s * 0.7} C ${cx - s} ${cy + s * 0.7}, ${cx - s} ${cy - s * 0.3}, ${cx} ${cy - s * 0.35} C ${cx + s} ${cy - s * 0.3}, ${cx + s} ${cy + s * 0.7}, ${cx} ${cy + s * 0.7} Z`) + p(`M ${cx} ${cy - s * 0.35} Q ${cx + s * 0.1} ${cy - s * 0.8} ${cx + s * 0.35} ${cy - s * 0.9}`) + e(cx + s * 0.35, cy - s * 0.55, s * 0.28, s * 0.14);
}
function banana(cx, cy, s) {
  return p(`M ${cx - s * 0.8} ${cy - s * 0.4} Q ${cx - s * 0.2} ${cy + s * 0.9} ${cx + s * 0.9} ${cy + s * 0.3} Q ${cx + s * 0.5} ${cy + s * 0.7} ${cx - s * 0.6} ${cy + s * 0.2} Q ${cx - s} ${cy - s * 0.2} ${cx - s * 0.8} ${cy - s * 0.4} Z`);
}
function strawberry(cx, cy, s) {
  let out = p(`M ${cx} ${cy + s * 0.85} C ${cx - s * 0.9} ${cy + s * 0.3}, ${cx - s * 0.7} ${cy - s * 0.4}, ${cx} ${cy - s * 0.35} C ${cx + s * 0.7} ${cy - s * 0.4}, ${cx + s * 0.9} ${cy + s * 0.3}, ${cx} ${cy + s * 0.85} Z`);
  out += p(`M ${cx - s * 0.35} ${cy - s * 0.35} Q ${cx} ${cy - s * 0.85} ${cx + s * 0.35} ${cy - s * 0.35}`);
  for (const [dx, dy] of [[-0.25, 0.1], [0.2, 0.05], [-0.1, 0.4], [0.25, 0.35], [0, 0.6]]) out += c(cx + s * dx, cy + s * dy, s * 0.06);
  return out;
}
function grapes(cx, cy, s) {
  let out = "";
  for (const [dx, dy] of [[0, -0.3], [-0.35, 0], [0.35, 0], [-0.55, 0.4], [0, 0.35], [0.55, 0.4], [-0.25, 0.75], [0.25, 0.75]]) out += c(cx + s * dx, cy + s * dy, s * 0.28);
  return out + line(cx, cy - s * 0.55, cx, cy - s * 0.95) + e(cx + s * 0.25, cy - s * 0.85, s * 0.25, s * 0.12);
}
function iceCream(cx, cy, s) {
  return poly(`${cx - s * 0.45},${cy + s * 0.2} ${cx + s * 0.45},${cy + s * 0.2} ${cx},${cy + s * 1.1}`) + c(cx - s * 0.25, cy - s * 0.05, s * 0.32) + c(cx + s * 0.25, cy - s * 0.05, s * 0.32) + c(cx, cy - s * 0.4, s * 0.35);
}
function pizza(cx, cy, s) {
  let out = p(`M ${cx} ${cy - s} L ${cx - s * 0.9} ${cy + s * 0.7} L ${cx + s * 0.9} ${cy + s * 0.7} Z`);
  for (const [dx, dy] of [[0, -0.2], [-0.25, 0.15], [0.25, 0.2], [0, 0.35]]) out += e(cx + s * dx, cy + s * dy, s * 0.12, s * 0.1);
  return out;
}
function planet(cx, cy, s) {
  return c(cx, cy, s) + e(cx, cy, s * 1.45, s * 0.35) + c(cx + s * 0.25, cy + s * 0.2, s * 0.15) + c(cx - s * 0.3, cy + s * 0.35, s * 0.1);
}
function moon(cx, cy, s) {
  return p(`M ${cx + s * 0.35} ${cy - s * 0.85} A ${s} ${s} 0 1 0 ${cx + s * 0.35} ${cy + s * 0.85} A ${s * 0.7} ${s * 0.7} 0 1 1 ${cx + s * 0.35} ${cy - s * 0.85} Z`) + c(cx - s * 0.15, cy - s * 0.2, s * 0.12) + c(cx + s * 0.05, cy + s * 0.25, s * 0.08);
}
function ufo(cx, cy, s) {
  return e(cx, cy, s, s * 0.35) + e(cx, cy - s * 0.25, s * 0.55, s * 0.35) + c(cx - s * 0.45, cy + s * 0.05, s * 0.08) + c(cx, cy + s * 0.1, s * 0.08) + c(cx + s * 0.45, cy + s * 0.05, s * 0.08);
}
function starShape(cx, cy, s) { return poly(starPts(cx, cy, 5, s, s * 0.4)); }

const pages = [];

function add(category, titlePt, drawFn) {
  const n = pages.length + 1;
  const id = `colorir-${String(n).padStart(3, "0")}`;
  const file = `/education/colorir/pages/${id}.svg`;
  const svg = wrap(frameDecor(n) + drawFn(n));
  pages.push({ id, file, titlePt, category, license: "CC0", attribution: "Sem Talento Studio", printFriendly: true, svg });
}

const animalDefs = [
  ["Gato", cat, 110], ["Cachorro", dog, 110], ["Peixe", fish, 120], ["Passaro", bird, 100],
  ["Borboleta", butterfly, 100], ["Coelho", rabbit, 100], ["Elefante", elephant, 120],
  ["Tartaruga", turtle, 100], ["Sapo", frog, 100], ["Pato", duck, 100], ["Caranguejo", crab, 90], ["Golfinho", dolphin, 110],
];
for (const [pt, fn, size] of animalDefs) {
  add("animals", pt, () => g(fn(CX, CY - 40, size)));
  add("animals", pt + " e sol", (n) => g(fn(CX - 80, CY + 40, size * 0.75) + sun(CX + 160, CY - 220, 50, 8 + (n % 4))));
  add("animals", pt + " no jardim", () => g(fn(CX, CY - 20, size * 0.7) + flower(CX - 180, CY + 200, 6, 40, 14) + flower(CX + 180, CY + 220, 5, 36, 12) + tree(CX + 200, CY + 280, 140)));
  add("animals", "Familia de " + pt.toLowerCase(), () => g(fn(CX - 120, CY, size * 0.85) + fn(CX + 140, CY + 40, size * 0.55)));
}

add("animals", "Leao", () => e(CX, CY, 120, 102) + c(CX, CY, 150, SF) + c(CX - 40, CY - 20, 12) + c(CX + 40, CY - 20, 12) + e(CX, CY + 30, 28, 18) + p(`M ${CX - 30} ${CY + 55} Q ${CX} ${CY + 80} ${CX + 30} ${CY + 55}`));
add("animals", "Urso", () => e(CX, CY, 108, 96) + c(CX - 70, CY - 80, 35) + c(CX + 70, CY - 80, 35) + c(CX - 35, CY - 10, 12) + c(CX + 35, CY - 10, 12) + e(CX, CY + 30, 30, 22));
add("animals", "Coruja", () => e(CX, CY, 77, 110) + c(CX - 35, CY - 20, 28) + c(CX + 35, CY - 20, 28) + c(CX - 35, CY - 20, 10) + c(CX + 35, CY - 20, 10) + poly(`${CX},${CY + 10} ${CX - 20},${CY + 40} ${CX + 20},${CY + 40}`));
add("animals", "Abelha", () => e(CX, CY, 70, 45) + line(CX - 40, CY - 20, CX + 40, CY - 20) + line(CX - 40, CY, CX + 40, CY) + line(CX - 40, CY + 20, CX + 40, CY + 20) + e(CX - 55, CY - 50, 40, 25) + e(CX + 55, CY - 50, 40, 25) + c(CX + 70, CY, 22));
add("animals", "Caracol", () => c(CX, CY - 20, 80) + c(CX, CY - 20, 50) + c(CX, CY - 20, 25) + p(`M ${CX + 70} ${CY + 20} Q ${CX + 160} ${CY + 40} ${CX + 180} ${CY - 10}`) + line(CX + 180, CY - 10, CX + 170, CY - 50));
add("animals", "Pinguim", () => e(CX, CY, 65, 100) + e(CX, CY + 10, 40, 70) + c(CX, CY - 95, 40) + c(CX - 12, CY - 100, 6) + c(CX + 12, CY - 100, 6) + poly(`${CX},${CY - 85} ${CX - 12},${CY - 70} ${CX + 12},${CY - 70}`) + e(CX - 70, CY, 22, 45) + e(CX + 70, CY, 22, 45));
add("animals", "Raposa", () => e(CX, CY, 85, 70) + poly(`${CX - 70},${CY - 40} ${CX - 90},${CY - 110} ${CX - 30},${CY - 55}`) + poly(`${CX + 70},${CY - 40} ${CX + 90},${CY - 110} ${CX + 30},${CY - 55}`) + c(CX - 30, CY - 5, 10) + c(CX + 30, CY - 5, 10) + e(CX, CY + 25, 22, 14));
add("animals", "Estrela-do-mar", () => starShape(CX, CY, 140) + c(CX - 30, CY - 10, 10) + c(CX + 30, CY - 10, 10));
add("animals", "Baleia", () => p(`M ${CX - 180} ${CY} Q ${CX - 40} ${CY - 100} ${CX + 160} ${CY - 20} Q ${CX + 200} ${CY} ${CX + 150} ${CY + 40} Q ${CX} ${CY + 90} ${CX - 180} ${CY} Z`) + p(`M ${CX + 40} ${CY - 60} L ${CX + 70} ${CY - 140} L ${CX + 110} ${CY - 50}`) + c(CX + 100, CY - 20, 10));
add("animals", "Cavalo", () => e(CX - 40, CY + 40, 110, 70) + e(CX + 80, CY - 40, 45, 55) + line(CX + 80, CY - 80, CX + 100, CY - 130) + e(CX + 110, CY - 140, 28, 18) + line(CX - 100, CY + 90, CX - 110, CY + 180) + line(CX - 40, CY + 100, CX - 30, CY + 180) + line(CX + 20, CY + 90, CX + 30, CY + 180) + line(CX + 60, CY + 80, CX + 80, CY + 170));
add("animals", "Porco", () => e(CX, CY, 110, 80) + e(CX - 90, CY - 40, 30, 40) + e(CX + 90, CY - 40, 30, 40) + e(CX, CY + 25, 35, 25) + c(CX - 10, CY + 20, 6) + c(CX + 10, CY + 20, 6) + c(CX - 40, CY - 15, 10) + c(CX + 40, CY - 15, 10));
add("animals", "Macaco", () => e(CX, CY, 90, 100) + c(CX, CY - 110, 50) + e(CX - 55, CY - 100, 22, 30) + e(CX + 55, CY - 100, 22, 30) + c(CX - 18, CY - 115, 8) + c(CX + 18, CY - 115, 8) + e(CX, CY - 90, 18, 12) + e(CX - 70, CY + 40, 25, 55) + e(CX + 70, CY + 40, 25, 55));
add("animals", "Girafa", () => e(CX, CY + 80, 70, 90) + rect(CX - 18, CY - 120, 36, 160, 12) + e(CX + 10, CY - 150, 40, 35) + c(CX + 25, CY - 155, 6) + line(CX - 50, CY + 150, CX - 55, CY + 220) + line(CX + 40, CY + 150, CX + 50, CY + 220) + c(CX - 5, CY - 40, 8) + c(CX - 5, CY, 8) + c(CX - 5, CY + 40, 8));

const vehicleDefs = [
  ["Carro", car, 110], ["Caminhao", truck, 100], ["Onibus", bus, 100], ["Bicicleta", bike, 100],
  ["Aviao", plane, 100], ["Barco", boat, 100], ["Trem", train, 100], ["Foguetinho", rocket, 100], ["Helicoptero", helicopter, 90],
];
for (const [pt, fn, size] of vehicleDefs) {
  add("vehicles", pt, () => g(fn(CX, CY, size)));
  add("vehicles", pt + " na estrada", () => g(fn(CX, CY - 40, size * 0.85) + line(80, CY + 160, VB_W - 80, CY + 160) + line(80, CY + 190, VB_W - 80, CY + 190) + sun(150, 180, 40, 8)));
  add("vehicles", pt + " e nuvens", () => g(fn(CX, CY + 40, size * 0.8) + cloud(200, 200, 40) + cloud(550, 240, 35)));
}
add("vehicles", "Scooter", () => c(CX - 60, CY + 60, 40) + c(CX + 80, CY + 60, 40) + line(CX - 60, CY + 60, CX + 40, CY - 40) + line(CX + 40, CY - 40, CX + 80, CY + 60) + line(CX + 40, CY - 40, CX + 20, CY - 90) + rect(CX - 10, CY - 20, 50, 18, 6));
add("vehicles", "Patins", () => rect(CX - 120, CY - 20, 100, 50, 12) + rect(CX + 20, CY - 20, 100, 50, 12) + c(CX - 100, CY + 50, 18) + c(CX - 60, CY + 50, 18) + c(CX + 40, CY + 50, 18) + c(CX + 80, CY + 50, 18));
add("vehicles", "Submarino", () => e(CX, CY, 160, 70) + rect(CX - 20, CY - 110, 40, 50, 6) + c(CX - 20, CY - 20, 18) + c(CX + 40, CY - 10, 12) + c(CX + 80, CY, 12) + p(`M ${CX + 160} ${CY} L ${CX + 220} ${CY - 30} L ${CX + 220} ${CY + 30} Z`));
add("vehicles", "Trator", () => rect(CX - 40, CY - 20, 140, 80, 10) + c(CX - 80, CY + 60, 55) + c(CX + 100, CY + 50, 35) + rect(CX - 20, CY - 70, 70, 50, 8) + c(CX - 80, CY + 60, 25) + c(CX + 100, CY + 50, 15));

for (let i = 0; i < 6; i++) {
  add("nature", `Flor ${i + 1}`, () => flower(CX, CY, 5 + (i % 4), 90 + i * 8, 28) + (i % 2 === 0 ? line(CX, CY + 30, CX, CY + 220) + line(CX, CY + 120, CX - 40, CY + 90) + line(CX, CY + 150, CX + 45, CY + 110) : ""));
}
add("nature", "Arvore", () => tree(CX, CY + 250, 280) + sun(600, 180, 45, 10));
add("nature", "Duas arvores", () => tree(CX - 160, CY + 250, 220) + tree(CX + 160, CY + 280, 180) + cloud(CX, 180, 45));
add("nature", "Sol e nuvens", () => sun(CX - 120, CY - 80, 70, 12) + cloud(CX + 140, CY - 40, 55) + cloud(CX + 60, CY + 80, 40));
add("nature", "Montanhas", () => poly(`${120},${CY + 200} ${300},${CY - 120} ${480},${CY + 200}`) + poly(`${350},${CY + 200} ${520},${CY - 80} ${700},${CY + 200}`) + sun(600, 200, 40, 8) + line(80, CY + 200, VB_W - 80, CY + 200));
add("nature", "Arco-iris", () => {
  let out = "";
  for (let i = 0; i < 5; i++) out += p(`M ${150 + i * 12} ${CY + 100} A ${220 - i * 18} ${220 - i * 18} 0 0 1 ${VB_W - 150 - i * 12} ${CY + 100}`);
  return out + cloud(180, CY + 80, 35) + cloud(VB_W - 180, CY + 80, 35);
});
add("nature", "Cogumelo", () => e(CX, CY - 40, 110, 70) + rect(CX - 35, CY - 20, 70, 140, 12) + c(CX - 50, CY - 50, 14) + c(CX + 40, CY - 60, 18) + c(CX + 10, CY - 30, 12));
add("nature", "Folha", () => p(`M ${CX} ${CY + 160} Q ${CX - 140} ${CY} ${CX} ${CY - 160} Q ${CX + 140} ${CY} ${CX} ${CY + 160} Z`) + line(CX, CY - 140, CX, CY + 140));
add("nature", "Cacto", () => rect(CX - 35, CY - 80, 70, 220, 30) + rect(CX - 110, CY, 75, 40, 20) + rect(CX - 110, CY - 60, 40, 80, 20) + rect(CX + 35, CY + 40, 75, 40, 20) + rect(CX + 70, CY - 20, 40, 80, 20));
add("nature", "Tulipa", () => p(`M ${CX - 50} ${CY} Q ${CX - 60} ${CY - 120} ${CX} ${CY - 140} Q ${CX + 60} ${CY - 120} ${CX + 50} ${CY} Z`) + line(CX, CY, CX, CY + 200));
add("nature", "Girassol", () => flower(CX, CY - 40, 12, 100, 40) + line(CX, CY + 20, CX, CY + 260));
add("nature", "Jardim", () => flower(CX - 180, CY + 40, 6, 50, 16) + flower(CX, CY, 5, 60, 18) + flower(CX + 180, CY + 60, 7, 45, 14) + tree(CX + 220, CY + 280, 160) + sun(150, 180, 40, 8));
add("nature", "Chuva alegre", () => cloud(CX, CY - 120, 70) + line(CX - 80, CY - 20, CX - 100, CY + 60) + line(CX - 20, CY, CX - 30, CY + 80) + line(CX + 40, CY - 10, CX + 30, CY + 70) + flower(CX, CY + 200, 5, 50, 16));
add("nature", "Lago", () => e(CX, CY + 80, 220, 80) + tree(CX - 200, CY + 40, 160) + tree(CX + 210, CY + 60, 140) + duck(CX - 40, CY + 60, 40) + sun(600, 180, 40, 8));
for (let i = 0; i < 8; i++) {
  add("nature", `Natureza ${i + 1}`, () => {
    let out = sun(120 + i * 20, 160, 35 + i * 2, 8) + tree(CX - 100 + i * 10, CY + 260, 160 + i * 8) + flower(CX + 150, CY + 100 + i * 5, 5 + (i % 3), 40, 12);
    if (i % 2 === 0) out += cloud(500, 220, 30 + i);
    if (i % 3 === 0) out += bird(CX + 200, CY - 100, 35);
    return out;
  });
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
for (let i = 0; i < letters.length; i++) {
  const ch = letters[i];
  add("letters", `Letra ${ch}`, () => bubbleLetter(ch, CX, CY - 40, 320) + flower(CX - 200, CY + 280, 5, 35, 12) + flower(CX + 200, CY + 280, 6, 35, 12));
}

for (let n = 0; n <= 9; n++) {
  add("numbers", `Numero ${n}`, () => bubbleLetter(String(n), CX, CY - 40, 340) + starShape(CX - 200, CY + 260, 40) + starShape(CX + 200, CY + 260, 40));
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
for (const [name, fn] of shapeBuilders) {
  add("shapes", name, fn);
  add("shapes", name + " decorado", () => fn() + c(CX - 220, CY - 280, 20) + c(CX + 220, CY - 280, 20) + c(CX - 220, CY + 280, 20) + c(CX + 220, CY + 280, 20));
}

add("scenes", "Casa", () => house(CX, CY + 200, 260) + sun(150, 180, 45, 10) + cloud(500, 200, 40));
add("scenes", "Casa e arvore", () => house(CX - 120, CY + 220, 220) + tree(CX + 180, CY + 240, 200) + sun(600, 160, 40, 8));
add("scenes", "Parque", () => tree(CX - 220, CY + 260, 180) + tree(CX + 220, CY + 280, 160) + flower(CX - 60, CY + 180, 5, 35, 12) + flower(CX + 40, CY + 200, 6, 30, 10) + sun(CX, 160, 50, 10) + bird(CX + 180, CY - 40, 40));
add("scenes", "Praia", () => line(80, CY + 40, VB_W - 80, CY + 40) + p(`M 80 ${CY + 40} Q 200 ${CY + 80} 350 ${CY + 40} Q 500 ${CY} 700 ${CY + 40}`) + sun(150, 180, 50, 10) + boat(CX + 80, CY - 40, 70) + c(CX - 150, CY + 120, 25) + c(CX - 100, CY + 140, 18));
add("scenes", "Fazenda", () => house(CX - 160, CY + 180, 180) + tree(CX + 200, CY + 220, 160) + e(CX + 40, CY + 200, 50, 35) + c(CX + 70, CY + 180, 22) + sun(600, 160, 40, 8));
add("scenes", "Cidade simples", () => rect(120, CY - 40, 100, 240, 4) + rect(250, CY - 120, 90, 320, 4) + rect(370, CY, 110, 200, 4) + rect(510, CY - 80, 100, 280, 4) + rect(140, CY, 30, 40, 2) + rect(270, CY - 60, 30, 40, 2) + rect(390, CY + 40, 30, 40, 2) + sun(650, 160, 35, 8));
add("scenes", "Acampamento", () => poly(`${CX},${CY - 80} ${CX - 140},${CY + 160} ${CX + 140},${CY + 160}`) + line(CX, CY - 80, CX, CY + 160) + rect(CX + 100, CY + 100, 18, 60, 4) + c(CX + 109, CY + 80, 22) + tree(CX - 220, CY + 200, 140) + moon(600, 180, 50));
add("scenes", "Castelo", () => rect(CX - 160, CY - 40, 320, 240, 4) + rect(CX - 200, CY - 120, 80, 320, 4) + rect(CX + 120, CY - 120, 80, 320, 4) + poly(`${CX - 200},${CY - 120} ${CX - 160},${CY - 180} ${CX - 120},${CY - 120}`) + poly(`${CX + 120},${CY - 120} ${CX + 160},${CY - 180} ${CX + 200},${CY - 120}`) + rect(CX - 30, CY + 80, 60, 120, 4) + sun(150, 160, 40, 8));
add("scenes", "Ponte", () => p(`M 100 ${CY + 80} Q ${CX} ${CY - 100} ${VB_W - 100} ${CY + 80}`) + line(100, CY + 80, VB_W - 100, CY + 80) + line(200, CY + 80, 200, CY - 20) + line(CX, CY + 80, CX, CY - 80) + line(VB_W - 200, CY + 80, VB_W - 200, CY - 20) + e(CX, CY + 160, 180, 40) + boat(CX, CY + 140, 40));
add("scenes", "Escola", () => house(CX, CY + 180, 300) + rect(CX - 40, CY - 200, 20, 80, 4) + poly(`${CX - 30},${CY - 200} ${CX - 30},${CY - 260} ${CX + 80},${CY - 220}`) + sun(150, 160, 40, 8) + flower(CX - 220, CY + 220, 5, 30, 10));
for (let i = 0; i < 12; i++) {
  add("scenes", `Cena ${i + 1}`, () => {
    let out = house(CX - 40 + (i % 3) * 20, CY + 200, 180 + (i % 4) * 15);
    out += tree(CX + 180, CY + 240, 140 + i * 5);
    out += sun(120 + i * 15, 170, 35, 8);
    if (i % 2 === 0) out += flower(CX - 200, CY + 220, 5, 30, 10);
    if (i % 3 === 0) out += cloud(500, 200, 35);
    if (i % 4 === 0) out += cat(CX + 60, CY + 160, 35);
    return out;
  });
}

const foodDefs = [
  ["Maca", apple, 110], ["Banana", banana, 110], ["Morango", strawberry, 110], ["Uvas", grapes, 90],
  ["Sorvete", iceCream, 100], ["Pizza", pizza, 110],
];
for (const [pt, fn, size] of foodDefs) {
  add("food", pt, () => g(fn(CX, CY - 20, size)));
  add("food", pt + " duplo", () => g(fn(CX - 130, CY, size * 0.75) + fn(CX + 130, CY + 20, size * 0.75)));
  add("food", "Prato com " + pt.toLowerCase(), () => e(CX, CY + 80, 200, 60) + fn(CX, CY - 40, size * 0.85));
}
add("food", "Melancia", () => {
  let out = p(`M ${CX - 140} ${CY + 40} A 140 140 0 0 1 ${CX + 140} ${CY + 40} L ${CX - 140} ${CY + 40} Z`);
  out += p(`M ${CX - 120} ${CY + 20} A 120 120 0 0 1 ${CX + 120} ${CY + 20}`);
  for (const [dx, dy] of [[-0.3, -0.15], [0.1, -0.35], [0.35, -0.05]]) out += e(CX + 100 * dx, CY + 100 * dy, 8, 12);
  return out;
});
add("food", "Laranja", () => c(CX, CY, 120) + p(`M ${CX} ${CY - 120} Q ${CX + 20} ${CY - 160} ${CX + 50} ${CY - 150}`) + e(CX + 40, CY - 130, 30, 14) + line(CX - 80, CY - 40, CX + 80, CY + 40) + line(CX - 40, CY - 80, CX + 40, CY + 80));
add("food", "Pera", () => p(`M ${CX} ${CY + 120} C ${CX - 90} ${CY + 120}, ${CX - 100} ${CY + 20}, ${CX - 60} ${CY - 40} C ${CX - 40} ${CY - 100}, ${CX + 40} ${CY - 100}, ${CX + 60} ${CY - 40} C ${CX + 100} ${CY + 20}, ${CX + 90} ${CY + 120}, ${CX} ${CY + 120} Z`) + line(CX, CY - 90, CX + 20, CY - 140));
add("food", "Cenoura", () => poly(`${CX - 50},${CY - 100} ${CX + 50},${CY - 100} ${CX},${CY + 160}`) + line(CX - 20, CY - 100, CX - 40, CY - 160) + line(CX, CY - 100, CX + 10, CY - 170) + line(CX + 20, CY - 100, CX + 45, CY - 155));
add("food", "Bolo", () => e(CX, CY + 80, 140, 40) + rect(CX - 140, CY - 40, 280, 120, 8) + e(CX, CY - 40, 140, 40) + c(CX - 60, CY - 80, 25) + c(CX, CY - 100, 28) + c(CX + 60, CY - 80, 25) + line(CX, CY - 125, CX, CY - 160));
add("food", "Cupcake", () => p(`M ${CX - 70} ${CY + 40} L ${CX - 90} ${CY + 140} L ${CX + 90} ${CY + 140} L ${CX + 70} ${CY + 40} Z`) + line(CX - 80, CY + 70, CX + 80, CY + 70) + line(CX - 85, CY + 100, CX + 85, CY + 100) + c(CX - 30, CY, 40) + c(CX + 30, CY, 40) + c(CX, CY - 40, 45) + c(CX + 10, CY - 80, 12));
add("food", "Donut", () => c(CX, CY, 120) + c(CX, CY, 50) + c(CX - 40, CY - 50, 12) + c(CX + 50, CY - 30, 10) + c(CX + 30, CY + 50, 11) + c(CX - 50, CY + 30, 9));
add("food", "Cookie", () => c(CX, CY, 130) + c(CX - 40, CY - 30, 14) + c(CX + 35, CY - 40, 12) + c(CX + 20, CY + 40, 15) + c(CX - 50, CY + 35, 11) + c(CX, CY, 10));
for (let i = 0; i < 6; i++) {
  add("food", `Lanche ${i + 1}`, () => apple(CX - 100, CY - 40, 70 - i) + banana(CX + 100, CY, 70) + strawberry(CX, CY + 140, 55 + i * 2));
}

add("space", "Foguete", () => rocket(CX, CY, 120) + starShape(150, 200, 25) + starShape(600, 280, 30) + starShape(500, 150, 20));
add("space", "Planeta", () => planet(CX, CY, 130) + starShape(120, 180, 22) + starShape(650, 220, 28));
add("space", "Lua", () => moon(CX, CY, 150) + starShape(150, 200, 25) + starShape(600, 300, 20) + starShape(550, 160, 18));
add("space", "OVNI", () => ufo(CX, CY, 120) + starShape(140, 180, 22) + starShape(620, 250, 26) + line(CX - 40, CY + 80, CX - 60, CY + 160) + line(CX + 40, CY + 80, CX + 60, CY + 160));
add("space", "Astronauta", () => c(CX, CY - 100, 55) + rect(CX - 55, CY - 50, 110, 140, 20) + c(CX, CY - 100, 35) + rect(CX - 90, CY - 20, 35, 80, 12) + rect(CX + 55, CY - 20, 35, 80, 12) + rect(CX - 40, CY + 90, 30, 70, 8) + rect(CX + 10, CY + 90, 30, 70, 8) + starShape(600, 200, 25));
add("space", "Satelite", () => rect(CX - 50, CY - 30, 100, 60, 8) + rect(CX - 150, CY - 10, 90, 20, 4) + rect(CX + 60, CY - 10, 90, 20, 4) + c(CX, CY, 18) + line(CX, CY - 30, CX, CY - 70) + c(CX, CY - 80, 12) + starShape(150, 200, 22));
add("space", "Cometa", () => c(CX + 80, CY - 40, 50) + p(`M ${CX + 40} ${CY - 20} L ${CX - 180} ${CY + 80} L ${CX - 160} ${CY + 40} L ${CX + 20} ${CY - 60} Z`) + starShape(200, 180, 20) + starShape(600, 300, 25));
add("space", "Sistema solar", () => c(CX, CY, 40) + c(CX, CY, 100, SF) + c(CX, CY, 160, SF) + c(CX, CY, 220, SF) + c(CX + 100, CY, 12) + c(CX - 160, CY + 20, 16) + c(CX + 200, CY - 40, 14) + c(CX - 50, CY - 210, 10));
for (let i = 0; i < 14; i++) {
  add("space", `Espaco ${i + 1}`, () => {
    let out = "";
    if (i % 3 === 0) out += rocket(CX, CY + 40, 80 + i * 2);
    else if (i % 3 === 1) out += planet(CX, CY, 90 + i * 3);
    else out += ufo(CX, CY, 80 + i * 2);
    out += moon(150 + i * 10, 180, 30 + (i % 5) * 4);
    for (let s = 0; s < 5; s++) out += starShape(120 + s * 120, 250 + ((i + s) % 4) * 40, 16 + (s % 3) * 4);
    return out;
  });
}

// Sports / extra scenes to reach ~280
add("scenes", "Bola de futebol", () => c(CX, CY, 140) + poly(starPts(CX, CY, 5, 50, 50)) + line(CX - 100, CY - 60, CX + 40, CY - 100) + line(CX + 40, CY - 100, CX + 110, CY - 20) + line(CX - 110, CY + 20, CX - 40, CY + 100) + line(CX - 40, CY + 100, CX + 80, CY + 70));
add("scenes", "Cesta de basquete", () => rect(CX - 80, CY - 200, 160, 20, 4) + rect(CX - 10, CY - 180, 20, 80, 4) + e(CX, CY - 80, 50, 18) + p(`M ${CX - 50} ${CY - 80} L ${CX - 60} ${CY + 40} L ${CX + 60} ${CY + 40} L ${CX + 50} ${CY - 80}`) + c(CX, CY + 100, 45));
add("scenes", "Raquete e bola", () => e(CX - 80, CY - 40, 70, 90) + e(CX - 80, CY - 40, 45, 60) + rect(CX - 95, CY + 50, 30, 140, 8) + c(CX + 120, CY + 80, 40));
add("scenes", "Trofeu", () => e(CX, CY - 60, 80, 70) + p(`M ${CX - 80} ${CY - 40} Q ${CX - 140} ${CY - 20} ${CX - 100} ${CY + 40}`) + p(`M ${CX + 80} ${CY - 40} Q ${CX + 140} ${CY - 20} ${CX + 100} ${CY + 40}`) + rect(CX - 25, CY + 10, 50, 60, 4) + rect(CX - 60, CY + 70, 120, 30, 6));
add("scenes", "Bandeira", () => line(CX - 120, CY - 200, CX - 120, CY + 200) + rect(CX - 120, CY - 200, 220, 120, 4) + heart(CX - 10, CY - 140, 35));

for (let i = 0; i < 20; i++) {
  const cats = ["animals", "vehicles", "nature", "food", "space", "shapes", "scenes"];
  const catName = cats[i % cats.length];
  add(catName, `Variacao ${i + 1}`, () => {
    const seed = i + 1;
    let out = sun(100 + seed * 8, 160, 30 + (seed % 5) * 3, 8);
    if (seed % 2 === 0) out += tree(CX + 160, CY + 260, 150);
    if (seed % 3 === 0) out += flower(CX - 180, CY + 100, 5 + (seed % 3), 40, 12);
    if (seed % 4 === 0) out += car(CX, CY, 70);
    else if (seed % 4 === 1) out += cat(CX, CY, 80);
    else if (seed % 4 === 2) out += rocket(CX, CY, 70);
    else out += house(CX - 40, CY + 180, 160);
    if (seed % 5 === 0) out += cloud(500, 220, 35);
    if (seed % 5 === 1) out += starShape(600, 300, 30);
    if (seed % 5 === 2) out += apple(CX + 180, CY - 40, 50);
    return out;
  });
}

function toAsciiTitle(s) {
  return s
    .replace(/á/g, "\\u00e1").replace(/à/g, "\\u00e0").replace(/ã/g, "\\u00e3").replace(/â/g, "\\u00e2")
    .replace(/é/g, "\\u00e9").replace(/ê/g, "\\u00ea").replace(/í/g, "\\u00ed")
    .replace(/ó/g, "\\u00f3").replace(/ô/g, "\\u00f4").replace(/õ/g, "\\u00f5")
    .replace(/ú/g, "\\u00fa").replace(/ç/g, "\\u00e7")
    .replace(/Á/g, "\\u00c1").replace(/É/g, "\\u00c9").replace(/Í/g, "\\u00cd")
    .replace(/Ó/g, "\\u00d3").replace(/Ú/g, "\\u00da").replace(/Ç/g, "\\u00c7");
}

function buildCatalogTs(entries) {
  const lines = [];
  lines.push("export type ColorirCategory =");
  lines.push('  | "animals"');
  lines.push('  | "vehicles"');
  lines.push('  | "nature"');
  lines.push('  | "letters"');
  lines.push('  | "numbers"');
  lines.push('  | "shapes"');
  lines.push('  | "scenes"');
  lines.push('  | "food"');
  lines.push('  | "space";');
  lines.push("");
  lines.push("export type ColorirPage = {");
  lines.push("  id: string;");
  lines.push("  file: string;");
  lines.push("  titlePt: string;");
  lines.push("  category: ColorirCategory;");
  lines.push('  license: "CC0";');
  lines.push("  attribution: string;");
  lines.push("  printFriendly: boolean;");
  lines.push("};");
  lines.push("");
  lines.push("export const colorirPages: ColorirPage[] = [");
  for (const e of entries) {
    const title = JSON.stringify(e.titlePt);
    lines.push(
      `  { id: ${JSON.stringify(e.id)}, file: ${JSON.stringify(e.file)}, titlePt: ${title}, category: ${JSON.stringify(e.category)}, license: "CC0", attribution: "Sem Talento Studio", printFriendly: true },`,
    );
  }
  lines.push("];");
  lines.push("");
  lines.push("export const colorirCategories: ColorirCategory[] = [");
  lines.push('  "animals",');
  lines.push('  "vehicles",');
  lines.push('  "nature",');
  lines.push('  "letters",');
  lines.push('  "numbers",');
  lines.push('  "shapes",');
  lines.push('  "scenes",');
  lines.push('  "food",');
  lines.push('  "space",');
  lines.push("];");
  lines.push("");
  return lines.join("\n");
}

fs.mkdirSync(PAGES_DIR, { recursive: true });
for (const f of fs.readdirSync(PAGES_DIR)) {
  if (f.endsWith(".svg")) fs.unlinkSync(path.join(PAGES_DIR, f));
}

for (const page of pages) {
  fs.writeFileSync(path.join(PAGES_DIR, `${page.id}.svg`), page.svg, "utf8");
}

const catalogEntries = pages.map(({ id, file, titlePt, category, license, attribution, printFriendly }) => ({
  id, file, titlePt, category, license, attribution, printFriendly,
}));
fs.writeFileSync(CATALOG_PATH, buildCatalogTs(catalogEntries), "utf8");

const jsonPath = path.join(ROOT, "public", "education", "colorir", "catalog.json");
fs.writeFileSync(jsonPath, JSON.stringify(catalogEntries, null, 2), "utf8");

const byCat = {};
for (const p of pages) byCat[p.category] = (byCat[p.category] || 0) + 1;
console.log("Generated", pages.length, "SVG coloring pages");
console.log("By category:", byCat);
console.log("Catalog:", CATALOG_PATH);
console.log("Pages dir:", PAGES_DIR);
