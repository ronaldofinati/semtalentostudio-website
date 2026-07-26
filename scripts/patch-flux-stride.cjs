const fs = require("fs");
const path = require("path");

const products = {
  pt: {
    flux: {
      id: "flux-stride",
      title: "Flux Stride Pro",
      tag: "Esportivo",
      description:
        "Sneaker performance lifestyle — mesh branco, overlays pretos, solado com continuidade lateral/sola. Lateral, perspectiva, superior e vista da sola.",
    },
  },
  en: {
    flux: {
      id: "flux-stride",
      title: "Flux Stride Pro",
      tag: "Athletic",
      description:
        "Performance lifestyle sneaker — white mesh, black overlays, sole with lateral/outsole continuity. Side, perspective, top and sole views.",
    },
  },
  es: {
    flux: {
      id: "flux-stride",
      title: "Flux Stride Pro",
      tag: "Deportivo",
      description:
        "Sneaker performance lifestyle — mesh blanco, overlays negros, suela con continuidad lateral/suela. Lateral, perspectiva, superior y vista de suela.",
    },
  },
  zh: {
    flux: {
      id: "flux-stride",
      title: "Flux Stride Pro",
      tag: "运动",
      description:
        "性能生活方式运动鞋 — 白色网面、黑色拼接、侧底连续外底。侧面、透视、俯视与鞋底视图。",
    },
  },
};

for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = data.projects.items["footwear-design"];
  const urban = item.products.find((p) => p.id === "urban-canvas");
  item.products = [urban, products[locale].flux].filter(Boolean);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale, item.products.length, "products");
}