export type ProjectCategory =
  | "footwear"
  | "product"
  | "inflatable"
  | "web"
  | "software"
  | "3d";

export interface Project {
  slug: string;
  category: ProjectCategory;
  featured: boolean;
  image?: string;
  status?: "live" | "development" | "coming-soon";
}

/** Projetos do portfólio (home/projetos) — sem itens que vivem em Ferramentas. */
export const projects: Project[] = [
  {
    slug: "footwear-design",
    category: "footwear",
    featured: true,
    status: "live",
  },
  {
    slug: "product-design",
    category: "product",
    featured: true,
    status: "live",
  },
  {
    slug: "inflatable-design",
    category: "inflatable",
    featured: true,
    status: "live",
  },
  {
    slug: "web-design",
    category: "web",
    featured: true,
    status: "live",
  },
];

/** Itens apresentados na página Ferramentas (além do SizeGuide). */
export const toolProjects: Project[] = [
  {
    slug: "labcad",
    category: "software",
    featured: false,
    status: "development",
  },
  {
    slug: "nestlab",
    category: "software",
    featured: false,
    status: "development",
  },
  {
    slug: "3d-models",
    category: "3d",
    featured: true,
    status: "live",
  },
];

const allProjects = [...projects, ...toolProjects];

export function getProject(slug: string): Project | undefined {
  return allProjects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return [...projects, ...toolProjects].filter((p) => p.featured);
}

export function getPortfolioProjects(): Project[] {
  return projects;
}

export function getToolProjects(): Project[] {
  return toolProjects;
}

export function getProjectsByCategory(category: ProjectCategory): Project[] {
  return allProjects.filter((p) => p.category === category);
}
