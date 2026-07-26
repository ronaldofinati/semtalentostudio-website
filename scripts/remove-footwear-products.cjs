const fs = require("fs");
const path = require("path");
const remove = new Set(["talento-rasteira", "last-studio"]);
for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = data.projects.items["footwear-design"];
  item.products = item.products.filter((p) => !remove.has(p.id));
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(locale, "products:", item.products.length);
}