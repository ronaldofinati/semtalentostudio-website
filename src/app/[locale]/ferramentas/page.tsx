import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/SectionHeader";
import { ToolsShowcase } from "@/components/ToolsShowcase";
import { getToolProjects } from "@/data/projects";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tools");
  const toolProjects = getToolProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />
      <ToolsShowcase toolProjects={toolProjects} />
    </div>
  );
}