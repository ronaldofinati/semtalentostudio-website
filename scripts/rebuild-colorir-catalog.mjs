/**
 * Rebuild colorir catalog: keep ~15 SVGs per category + publish PNGs from Assets.
 * Run: node scripts/rebuild-colorir-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PAGES_DIR = path.join(ROOT, "public", "education", "colorir", "pages");
const PNG_DIR = path.join(PAGES_DIR, "png");
const SRC_PNG = "D:\\Sem Talento Studio\\Assets\\materials\\educacao\\colorir-atualizado";
const CATALOG_TS = path.join(ROOT, "src", "data", "colorir-catalog.ts");
const CATALOG_JSON = path.join(ROOT, "public", "education", "colorir", "catalog.json");
const MSG_FILES = ["pt", "en", "es", "zh"].map((l) =>
  path.join(ROOT, "messages", `${l}.json`),
);

const ATTRIB = "Sem Talento Studio";

function slugify(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function titleFromFilename(name) {
  // "01-Vaquinha.png" -> "Vaquinha"; fix common typos in filenames
  let base = name.replace(/\.[^.]+$/, "");
  base = base.replace(/^\d+[-_\s]*/, "");
  const fixes = {
    Vaquina: "Vaquinha",
  };
  for (const [bad, good] of Object.entries(fixes)) {
    if (base === bad || base.startsWith(bad + " ")) base = base.replace(bad, good);
  }
  return base.trim();
}

function folderCategory(folderName) {
  const n = folderName.toLowerCase();
  if (n.includes("fazenda")) return "farm";
  if (n.includes("floresta")) return "forest";
  if (n.includes("bichinho")) return "bugs";
  if (n.includes("contos") || n.includes("fadas")) return "fairytales";
  if (n.includes("espa") || n === "espaço" || n === "espaco") return "space";
  if (n.includes("fruta")) return "food";
  if (n.includes("transporte")) return "vehicles";
  if (n.includes("varios") || n.includes("vários")) return null; // decide per title
  return "scenes";
}

function categorizeVarious(title) {
  const t = title.toLowerCase();
  if (/dino|tartaruga|foca|p[oô]nei/.test(t)) return "animals";
  if (/astronauta|foguete|nave|espacial|planeta/.test(t)) return "space";
  if (/castelo|pr[ií]ncipe|princesa|fada/.test(t)) return "fairytales";
  if (/carro|caminh|avi[aã]o|helic|bal[aã]o|navio|submarino|trator|locom/.test(t))
    return "vehicles";
  if (/mar|praia|jardim|fundo/.test(t)) return "scenes";
  return "scenes";
}

// Parse existing catalog
const oldTs = fs.readFileSync(CATALOG_TS, "utf8");
const oldPages = [
  ...oldTs.matchAll(
    /\{ id: "([^"]+)", file: "([^"]+)", titlePt: "([^"]+)", category: "([^"]+)"[^}]*\}/g,
  ),
].map((m) => ({
  id: m[1],
  file: m[2],
  titlePt: m[3],
  category: m[4],
  license: "CC0",
  attribution: ATTRIB,
  printFriendly: true,
}));

const SKIP_TITLE =
  /( e sol| no jardim|Familia | na estrada| e nuvens| duplo| decorado| elaborado| elaborada|Prato com |Cena \d|Natureza \d|Espaco \d|Espaço \d|Forma \d|Letra [P-Z])/i;

function pickSvgKeepers(pages, limit = 15) {
  const byCat = {};
  for (const p of pages) {
    if (!p.file.endsWith(".svg")) continue;
    (byCat[p.category] ||= []).push(p);
  }
  const kept = [];
  for (const [cat, list] of Object.entries(byCat)) {
    // prefer clean unique titles first
    const preferred = list.filter((p) => !SKIP_TITLE.test(p.titlePt));
    const rest = list.filter((p) => SKIP_TITLE.test(p.titlePt));
    const ordered = [...preferred, ...rest];
    const seen = new Set();
    const chosen = [];
    for (const p of ordered) {
      const key = p.titlePt.toLowerCase().replace(/\s+\d+$/, "");
      if (seen.has(key)) continue;
      seen.add(key);
      chosen.push(p);
      if (chosen.length >= limit) break;
    }
    // numbers: keep all (only 10)
    if (cat === "numbers") {
      kept.push(...list);
    } else {
      kept.push(...chosen);
    }
  }
  return kept;
}

const svgKeepers = pickSvgKeepers(oldPages, 15);
const keepIds = new Set(svgKeepers.map((p) => p.id));
const keepFiles = new Set(svgKeepers.map((p) => path.basename(p.file)));

// Copy PNGs
fs.mkdirSync(PNG_DIR, { recursive: true });
const pngPages = [];
let pngIndex = 1;

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (/\.png$/i.test(ent.name)) {
      const folder = path.basename(path.dirname(full));
      let title = titleFromFilename(ent.name);
      let category = folderCategory(folder);
      if (!category) category = categorizeVarious(title);
      // disambiguate duplicate titles within same category
      const slug = slugify(`${category}-${title}`) || `png-${pngIndex}`;
      const id = `colorir-png-${String(pngIndex).padStart(3, "0")}`;
      const destName = `${id}-${slug}.png`;
      const dest = path.join(PNG_DIR, destName);
      fs.copyFileSync(full, dest);
      pngPages.push({
        id,
        file: `/education/colorir/pages/png/${destName}`,
        titlePt: title,
        category,
        license: "CC0",
        attribution: ATTRIB,
        printFriendly: true,
      });
      pngIndex++;
      console.log("PNG", id, title, "->", category);
    }
  }
}

if (!fs.existsSync(SRC_PNG)) throw new Error("Missing source: " + SRC_PNG);
walk(SRC_PNG);

// Put PNGs first within each category group for visibility (elaborate first)
const categoriesOrder = [
  "animals",
  "farm",
  "forest",
  "bugs",
  "vehicles",
  "nature",
  "fairytales",
  "letters",
  "numbers",
  "shapes",
  "scenes",
  "food",
  "space",
];

const allPages = [...pngPages, ...svgKeepers];
allPages.sort((a, b) => {
  const ca = categoriesOrder.indexOf(a.category);
  const cb = categoriesOrder.indexOf(b.category);
  if (ca !== cb) return (ca < 0 ? 99 : ca) - (cb < 0 ? 99 : cb);
  // png before svg within category
  const ap = a.file.endsWith(".png") ? 0 : 1;
  const bp = b.file.endsWith(".png") ? 0 : 1;
  if (ap !== bp) return ap - bp;
  return a.titlePt.localeCompare(b.titlePt, "pt");
});

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const catUnion = [...new Set(allPages.map((p) => p.category))];
const categories = categoriesOrder.filter((c) => catUnion.includes(c));

const tsOut = `export type ColorirCategory =
${categories.map((c) => `  | "${c}"`).join("\n")};

export type ColorirPage = {
  id: string;
  file: string;
  titlePt: string;
  category: ColorirCategory;
  license: "CC0";
  attribution: string;
  printFriendly: boolean;
};

export const colorirPages: ColorirPage[] = [
${allPages
  .map(
    (p) =>
      `  { id: "${p.id}", file: "${p.file}", titlePt: "${esc(p.titlePt)}", category: "${p.category}", license: "CC0", attribution: "${ATTRIB}", printFriendly: true },`,
  )
  .join("\n")}
];

export const colorirCategories: ColorirCategory[] = [
  ${categories.map((c) => `"${c}"`).join(", ")},
];
`;

fs.writeFileSync(CATALOG_TS, tsOut, "utf8");
fs.writeFileSync(
  CATALOG_JSON,
  JSON.stringify({ pages: allPages, categories }, null, 2),
  "utf8",
);

// i18n category labels
const labels = {
  pt: {
    animals: "Animais",
    farm: "Fazenda",
    forest: "Floresta",
    bugs: "Bichinhos",
    vehicles: "Veículos",
    nature: "Natureza",
    fairytales: "Contos de fadas",
    letters: "Letras",
    numbers: "Números",
    shapes: "Formas",
    scenes: "Cenas",
    food: "Comida",
    space: "Espaço",
  },
  en: {
    animals: "Animals",
    farm: "Farm",
    forest: "Forest",
    bugs: "Bugs",
    vehicles: "Vehicles",
    nature: "Nature",
    fairytales: "Fairy tales",
    letters: "Letters",
    numbers: "Numbers",
    shapes: "Shapes",
    scenes: "Scenes",
    food: "Food",
    space: "Space",
  },
  es: {
    animals: "Animales",
    farm: "Granja",
    forest: "Bosque",
    bugs: "Bichitos",
    vehicles: "Vehículos",
    nature: "Naturaleza",
    fairytales: "Cuentos de hadas",
    letters: "Letras",
    numbers: "Números",
    shapes: "Formas",
    scenes: "Escenas",
    food: "Comida",
    space: "Espacio",
  },
  zh: {
    animals: "动物",
    farm: "农场",
    forest: "森林",
    bugs: "小虫子",
    vehicles: "交通工具",
    nature: "自然",
    fairytales: "童话",
    letters: "字母",
    numbers: "数字",
    shapes: "形状",
    scenes: "场景",
    food: "食物",
    space: "太空",
  },
};

for (const file of MSG_FILES) {
  const lang = path.basename(file, ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!data.tools?.imagensColorir) continue;
  data.tools.imagensColorir.categories = labels[lang] || labels.en;
  // update description counts lightly
  if (lang === "pt") {
    data.tools.imagensColorir.description =
      "Desenhos para colorir — simples e elaborados. Baixe ou imprima grátis (CC0).";
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

// Delete unused SVGs (keep only selected)
let deleted = 0;
for (const f of fs.readdirSync(PAGES_DIR)) {
  if (!f.endsWith(".svg")) continue;
  if (!keepFiles.has(f)) {
    fs.unlinkSync(path.join(PAGES_DIR, f));
    deleted++;
  }
}

// counts
const counts = {};
for (const p of allPages) counts[p.category] = (counts[p.category] || 0) + 1;
console.log("\nKept SVG:", svgKeepers.length);
console.log("New PNG:", pngPages.length);
console.log("Total:", allPages.length);
console.log("Deleted unused SVG:", deleted);
console.log("Counts:", counts);