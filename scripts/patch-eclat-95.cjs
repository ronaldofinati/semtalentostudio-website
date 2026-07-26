const fs = require("fs");
const path = require("path");

const eclat = {
  pt: { id: "eclat-95", title: "Éclat 95", tag: "Feminino", description: "Scarpin stiletto 95 mm em couro verniz champagne dourado — brilho intenso, bico fino e salto metálico. Lateral, perspectiva, superior e sola." },
  en: { id: "eclat-95", title: "Éclat 95", tag: "Women's", description: "95 mm stiletto pump in champagne gold patent leather — high gloss, pointed toe and metallic heel. Side, perspective, top and sole views." },
  es: { id: "eclat-95", title: "Éclat 95", tag: "Femenino", description: "Stiletto 95 mm en charol champagne dorado — brillo intenso, punta fina y tacón metálico. Lateral, perspectiva, superior y suela." },
  zh: { id: "eclat-95", title: "Éclat 95", tag: "女款", description: "95毫米细高跟漆皮香槟金 — 高光泽尖头金属鞋跟。侧面、透视、俯视与鞋底视图。" },
};

for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = data.projects.items["footwear-design"];
  const existing = item.products.filter((p) => p.id !== "eclat-95");
  item.products = [...existing, eclat[locale]];
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale, item.products.length);
}