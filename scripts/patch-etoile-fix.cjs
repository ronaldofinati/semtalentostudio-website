const fs = require("fs");
const path = require("path");
const desc = {
  pt: "Sapatilha de ponta clássica em cetim rosé — fitas soltas, caixa reforçada e acabamento para dança. Renders de estúdio com luz quente.",
  en: "Classic rose satin pointe shoe — loose ribbons, reinforced box and dance-ready finish. Studio renders with warm lighting.",
  es: "Zapatilla de punta clásica en satén rosé — cintas sueltas, caja reforzada y acabado para danza. Renders de estudio con luz cálida.",
  zh: "经典玫瑰色缎面足尖鞋 — 缎带舒展、加固鞋头与舞蹈级工艺。暖色影棚渲染。",
};
for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const p = data.projects.items["footwear-design"].products.find((x) => x.id === "etoile-pointe");
  if (p) {
    p.description = desc[locale];
    delete p.viewLabels;
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale);
}