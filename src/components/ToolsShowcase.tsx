"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { ProjectCard, ShowcaseCard } from "@/components/ProjectCard";
import { SizeGuideSection } from "@/components/SizeGuideSection";
import { useToolHashSync } from "@/hooks/useToolHashSync";
import { isEducationToolHash } from "@/lib/tool-hash";
import type { Project } from "@/data/projects";

type ToolsShowcaseProps = {
  toolProjects: Project[];
};

type ActiveTool = "size-guide";

function hashToTool(hash: string): ActiveTool | null {
  if (hash === "#size-guide") return "size-guide";
  return null;
}

const SECTION_HASHES = ["#software", "#utilitarios", "#converter"] as const;

export function ToolsShowcase({ toolProjects }: ToolsShowcaseProps) {
  const t = useTranslations("tools");
  const router = useRouter();

  const onSectionHash = useCallback((hash: string) => {
    if ((SECTION_HASHES as readonly string[]).includes(hash)) {
      document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const { active, setTool } = useToolHashSync<ActiveTool>({
    hashToTool,
    onSectionHash,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (isEducationToolHash(hash)) {
      router.replace(`/educacao${hash}`);
    }
  }, [router]);

  const softwareProjects = toolProjects.filter(
    (p) => p.slug === "labcad" || p.slug === "nestlab",
  );
  const utilityProjects = toolProjects.filter((p) => p.slug === "3d-models");

  if (active === "size-guide") {
    return (
      <SizeGuideSection
        forceOpen
        onOpenChange={(open) => setTool(open ? "size-guide" : null)}
      />
    );
  }

  return (
    <div className="space-y-14">
      <section aria-labelledby="tools-software-heading">
        <div id="software" className="scroll-mt-24 mb-6">
          <h2
            id="tools-software-heading"
            className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl"
          >
            {t("sections.software.title")}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-text-muted sm:text-base">
            {t("sections.software.subtitle")}
          </p>
        </div>
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2">
          <SizeGuideSection
            onOpenChange={(open) => setTool(open ? "size-guide" : null)}
          />
          {softwareProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} didactic />
          ))}
        </div>
      </section>

      <section aria-labelledby="tools-utilities-heading">
        <div id="utilitarios" className="scroll-mt-24 mb-6">
          <h2
            id="tools-utilities-heading"
            className="font-display text-xl font-semibold tracking-tight text-text sm:text-2xl"
          >
            {t("sections.utilities.title")}
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-text-muted sm:text-base">
            {t("sections.utilities.subtitle")}
          </p>
        </div>
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2">
          {utilityProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} didactic />
          ))}
          <ShowcaseCard
            id="converter"
            title={t("coming.converter.title")}
            description={t("coming.converter.description")}
            category={t("coming.converter.category")}
            gradient="from-sky-900/25 to-surface-muted"
            initial="C"
            introTitle={t("coming.converter.introTitle")}
            introBody={t("coming.converter.introBody")}
            introContinue={t("coming.converter.introContinue")}
            introClose={t("coming.converter.introClose")}
          />
          <ShowcaseCard
            title={t("coming.plugins.title")}
            description={t("coming.plugins.description")}
            category={t("coming.plugins.category")}
            gradient="from-violet-900/25 to-surface-muted"
            initial="P"
            introTitle={t("coming.plugins.introTitle")}
            introBody={t("coming.plugins.introBody")}
            introContinue={t("coming.plugins.introContinue")}
            introClose={t("coming.plugins.introClose")}
          />
        </div>
      </section>
    </div>
  );
}
