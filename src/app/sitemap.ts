import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const base = "https://semtalentostudio.com.br";

const paths = [
  "",
  "/projetos",
  "/projetos/footwear-design",
  "/projetos/product-design",
  "/ferramentas",
  "/educacao",
  "/conteudo",
  "/sobre",
  "/contato",
  "/privacidade",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }
  }
  return entries;
}