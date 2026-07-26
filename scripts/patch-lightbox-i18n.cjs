const fs = require("fs");
const path = require("path");
const keys = {
  pt: { zoomImage: "Ampliar imagem", closeZoom: "Fechar", previousImage: "Imagem anterior", nextImage: "Próxima imagem", zoomHint: "Clique para ampliar" },
  en: { zoomImage: "Zoom image", closeZoom: "Close", previousImage: "Previous image", nextImage: "Next image", zoomHint: "Click to zoom" },
  es: { zoomImage: "Ampliar imagen", closeZoom: "Cerrar", previousImage: "Imagen anterior", nextImage: "Siguiente imagen", zoomHint: "Clic para ampliar" },
  zh: { zoomImage: "放大图片", closeZoom: "关闭", previousImage: "上一张", nextImage: "下一张", zoomHint: "点击放大" },
};
for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  Object.assign(data.common, keys[locale]);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale);
}