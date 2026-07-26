const fs = require("fs");
const path = require("path");

const night = {
  pt: { id: "flux-stride-night", title: "Flux Stride Pro — Night", tag: "Esportivo", description: "Variante mesh preto com forro branco visível no colarinho — mesma sola creme sem faixa laranja. Lateral, perspectiva, superior e sola." },
  en: { id: "flux-stride-night", title: "Flux Stride Pro — Night", tag: "Athletic", description: "Black mesh variant with white collar lining — same cream sole without orange stripe. Side, perspective, top and sole views." },
  es: { id: "flux-stride-night", title: "Flux Stride Pro — Night", tag: "Deportivo", description: "Variante mesh negro con forro blanco visible — misma suela crema sin franja naranja. Lateral, perspectiva, superior y suela." },
  zh: { id: "flux-stride-night", title: "Flux Stride Pro — Night", tag: "运动", description: "黑色网面变体，白色内衬领口可见 — 同款米色鞋底无橙色条纹。侧面、透视、俯视与鞋底。" },
};

for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = data.projects.items["footwear-design"];
  const existing = item.products.filter((p) => p.id !== "flux-stride-night");
  item.products = [...existing, night[locale]];
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale, item.products.length);
}