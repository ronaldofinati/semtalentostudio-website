/**
 * Slides da apresentação animada na home.
 * Para trocar imagens: altere apenas `image` em cada item.
 * `image: null` = slide só com texto (sem foto).
 * `layout`: default | center (texto centralizado) | outro (só logo)
 * `category`: botão canto superior esquerdo (null = sem botão, slides finais)
 */
export const STUDIO_PRESENTATION_SLIDES = [
  { id: "intro", image: "/projects/footwear/cover.webp", layout: "default", category: "design" },
  { id: "footwear", image: "/projects/footwear/injection-shoes-01.webp", layout: "default", category: "design" },
  { id: "sport", image: "/projects/footwear/flux-stride-01.webp", layout: "default", category: "design" },
  { id: "retro", image: "/projects/footwear/le-cheval-02.webp", layout: "default", category: "design" },
  { id: "kids", image: "/projects/footwear/kids-playroom-00.webp", layout: "default", category: "design" },
  { id: "product", image: "/projects/product/celular-02.webp", layout: "default", category: "design" },
  { id: "industrial", image: "/projects/product/ferramentas-03.webp", layout: "default", category: "design" },
  { id: "productFan", image: "/projects/product/ventilador-grande-01.webp", layout: "default", category: "design" },
  { id: "inflatables", image: "/projects/inflatable/inflavel-grande-04.webp", layout: "default", category: "design" },
  { id: "inflatablesMario", image: "/projects/inflatable/mario-01.webp", layout: "default", category: "design" },
  { id: "web", image: "/projects/web-design/footwear-store.webp", layout: "default", category: "ferramentas" },
  { id: "webMarketplace", image: "/projects/web-design/marketplace.webp", layout: "default", category: "ferramentas" },
  { id: "educationQuiz", image: "/projects/software/simulador-educacional/cover.svg", layout: "default", category: "educacao" },
  { id: "educationLab", image: "/education/slides/04-quimica-lab.jpg", layout: "default", category: "educacao" },
  { id: "models3d", image: "/projects/3d-models/slides/09-bubble.jpg", layout: "default", category: "ferramentas" },
  { id: "toolsSoft", image: "/projects/software/cover.webp", layout: "default", category: "ferramentas" },
  { id: "pillars", image: null, layout: "center", category: null },
  { id: "cta", image: null, layout: "center", category: null },
  { id: "outro", image: null, layout: "outro", category: null },
] as const;

export type StudioPresentationSlideId =
  (typeof STUDIO_PRESENTATION_SLIDES)[number]["id"];

export type StudioPresentationSlideLayout =
  (typeof STUDIO_PRESENTATION_SLIDES)[number]["layout"];

export type StudioPresentationCategory =
  NonNullable<(typeof STUDIO_PRESENTATION_SLIDES)[number]["category"]>;

export const STUDIO_PRESENTATION_CATEGORY_HREF: Record<
  StudioPresentationCategory,
  "/projetos" | "/educacao" | "/ferramentas"
> = {
  design: "/projetos",
  educacao: "/educacao",
  ferramentas: "/ferramentas",
};

export const STUDIO_PRESENTATION_INTERVAL_MS = 5000;

/** Duração extra nos slides finais (ms) — demais slides usam o intervalo padrão */
export const STUDIO_PRESENTATION_SLIDE_DURATION_MS: Partial<
  Record<StudioPresentationSlideId, number>
> = {
  cta: 8000,
  outro: 10000,
};

export function getStudioPresentationSlideDurationMs(
  slideId: StudioPresentationSlideId,
): number {
  return STUDIO_PRESENTATION_SLIDE_DURATION_MS[slideId] ?? STUDIO_PRESENTATION_INTERVAL_MS;
}

/** Música clássica CC0 — Bach, Prelúdio em Dó maior (Kimiko Ishizaka / Wikimedia Commons) */
export const STUDIO_PRESENTATION_AUDIO = {
  src: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Kimiko_Ishizaka_-_Bach_-_Well-Tempered_Clavier%2C_Book_1_-_01_Prelude_No._1_in_C_major%2C_BWV_846.ogg",
  volume: 0.28,
} as const;