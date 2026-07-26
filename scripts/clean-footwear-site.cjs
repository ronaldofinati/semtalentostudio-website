const fs = require("fs");
const path = require("path");
for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = data.projects.items["footwear-design"];
  delete item.galleryTitle;
  delete item.gallerySubtitle;
  delete item.products;
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("cleaned", locale);
}