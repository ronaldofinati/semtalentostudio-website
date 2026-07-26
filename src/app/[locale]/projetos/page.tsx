import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { getPortfolioProjects } from "@/data/projects";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectsContent />;
}

function ProjectsContent() {
  const t = useTranslations("projects");
  const projects = getPortfolioProjects();

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="grid min-w-0 gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <div key={project.slug} className="min-w-0">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
