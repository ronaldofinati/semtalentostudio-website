const fs = require("fs");
const path = require("path");

const footwear = {
  pt: {
    galleryTitle: "Desenvolvimentos em destaque",
    gallerySubtitle:
      "Modelagem 3D com renders de estúdio — base reproduzível para evolução no Rhino ou KeyShot.",
    product: {
      id: "urban-canvas",
      title: "Urban Canvas 70",
      tag: "Casual",
      description:
        "Tênis canvas low-top clássico — lateral, perspectiva, vista superior e detalhe de cadarços e ilhós. Modelagem consistente, pronta para evoluir no render.",
    },
  },
  en: {
    galleryTitle: "Featured developments",
    gallerySubtitle:
      "3D modeling with studio renders — reproducible base ready to evolve in Rhino or KeyShot.",
    product: {
      id: "urban-canvas",
      title: "Urban Canvas 70",
      tag: "Casual",
      description:
        "Classic low-top canvas sneaker — side, perspective, top view and lace/eyelet detail. Consistent modeling, ready for render refinement.",
    },
  },
  es: {
    galleryTitle: "Desarrollos destacados",
    gallerySubtitle:
      "Modelado 3D con renders de estudio — base reproducible lista para evolucionar en Rhino o KeyShot.",
    product: {
      id: "urban-canvas",
      title: "Urban Canvas 70",
      tag: "Casual",
      description:
        "Zapatilla canvas low-top clásica — lateral, perspectiva, vista superior y detalle de cordones e ilhós. Modelado consistente, listo para mejorar el render.",
    },
  },
  zh: {
    galleryTitle: "精选开发项目",
    gallerySubtitle: "3D 建模与影棚渲染 — 可复现基础，便于在 Rhino 或 KeyShot 中继续精修。",
    product: {
      id: "urban-canvas",
      title: "Urban Canvas 70",
      tag: "休闲",
      description:
        "经典低帮帆布运动鞋 — 侧面、透视、俯视图与鞋带/鞋眼细节。建模一致，可继续优化渲染。",
    },
  },
};

for (const locale of ["pt", "en", "es", "zh"]) {
  const file = path.join("messages", locale + ".json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const t = footwear[locale];
  data.projects.items["footwear-design"].galleryTitle = t.galleryTitle;
  data.projects.items["footwear-design"].gallerySubtitle = t.gallerySubtitle;
  data.projects.items["footwear-design"].products = [t.product];
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("ok", locale);
}