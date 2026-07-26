const fs = require("fs");
const path = require("path");
const etoile = {
  pt: { id: "etoile-pointe", title: "Étoile Pointe", tag: "Dança", layout: "pair", viewLabels: ["Par frontal", "Ângulo artístico", "Vista superior", "Detalhe da caixa"], description: "Sapatilha de ponta clássica em cetim rosé — o par sempre em cena, fitas soltas, luz quente de estúdio. Card em formato panorâmico." },
  en: { id: "etoile-pointe", title: "Étoile Pointe", tag: "Dance", layout: "pair", viewLabels: ["Front pair", "Artistic angle", "Top view", "Box detail"], description: "Classic rose satin pointe shoes — the pair always in scene, loose ribbons, warm studio light. Panoramic card layout." },
  es: { id: "etoile-pointe", title: "Étoile Pointe", tag: "Danza", layout: "pair", viewLabels: ["Par frontal", "Ángulo artístico", "Vista superior", "Detalle de caja"], description: "Zapatilla de punta clásica en satén rosé — el par siempre en escena, cintas sueltas, luz cálida. Tarjeta panorámica." },
  zh: { id: "etoile-pointe", title: "Étoile Pointe", tag: "舞蹈", layout: "pair", viewLabels: ["正面双鞋", "艺术角度", "俯视图", "鞋头细节"], description: "经典玫瑰色缎面足尖鞋 — 双鞋同框，缎带舒展，暖色影棚光。全景卡片布局。" },
};
for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = data.projects.items["footwear-design"];
  item.products = [...item.products.filter((p) => p.id !== "etoile-pointe"), etoile[locale]];
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale);
}