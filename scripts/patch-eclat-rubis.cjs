const fs = require("fs");
const path = require("path");
const rubis = {
  pt: { id: "eclat-95-rubis", title: "Éclat 95 — Rubis", tag: "Feminino", description: "Variante em verniz rubi intenso com salto dourado — mesmo stiletto 95 mm, brilho dramático para noite. Lateral, perspectiva, superior e sola." },
  en: { id: "eclat-95-rubis", title: "Éclat 95 — Rubis", tag: "Women's", description: "Deep ruby patent variant with gold heel — same 95 mm stiletto, dramatic gloss for evening. Side, perspective, top and sole views." },
  es: { id: "eclat-95-rubis", title: "Éclat 95 — Rubis", tag: "Femenino", description: "Variante charol rubí intenso con tacón dorado — mismo stiletto 95 mm, brillo dramático. Lateral, perspectiva, superior y suela." },
  zh: { id: "eclat-95-rubis", title: "Éclat 95 — Rubis", tag: "女款", description: "深红宝石漆皮变体配金色鞋跟 — 同款95毫米细高跟，晚宴光泽。侧面、透视、俯视与鞋底。" },
};
for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = data.projects.items["footwear-design"];
  item.products = [...item.products.filter((p) => p.id !== "eclat-95-rubis"), rubis[locale]];
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale, item.products.length);
}