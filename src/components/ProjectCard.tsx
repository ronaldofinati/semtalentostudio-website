"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { Project } from "@/data/projects";
import { PROJECT_CARD_SLIDESHOWS, PROJECT_COVERS } from "@/data/project-media";
import { CardImageSlideshow } from "@/components/CardImageSlideshow";
import { ToolIntroDialog } from "@/components/ToolIntroDialog";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  href?: string;
  /** Quando true, clique abre intro didatica antes de navegar. */
  didactic?: boolean;
}

const categoryColors: Record<Project["category"], string> = {
  footwear: "from-amber-900/30 to-surface-muted",
  product: "from-slate-700/30 to-surface-muted",
  inflatable: "from-rose-900/25 to-surface-muted",
  web: "from-blue-900/20 to-surface-muted",
  software: "from-emerald-900/20 to-surface-muted",
  "3d": "from-purple-900/20 to-surface-muted",
};

export function ProjectCard({ project, href, didactic = false }: ProjectCardProps) {
  const t = useTranslations("projects.items");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [introOpen, setIntroOpen] = useState(false);

  const title = t(`${project.slug}.title`);
  const description = t(`${project.slug}.description`);
  const category = t(`${project.slug}.category`);
  const cover = PROJECT_COVERS[project.slug];
  const slideshow = PROJECT_CARD_SLIDESHOWS[project.slug];
  const target = href ?? `/projetos/${project.slug}`;

  const media = (
    <div
      className={cn(
        "relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br",
        categoryColors[project.category],
      )}
    >
      {slideshow && slideshow.length > 0 ? (
        <CardImageSlideshow images={slideshow} alt={title} />
      ) : cover ? (
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <span className="font-display text-5xl font-bold text-brand/20 transition-colors group-hover:text-brand/40">
          {category.charAt(0)}
        </span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated/80 via-transparent to-transparent" />
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light">
          {category}
        </span>
        {(project.status === "development" || project.status === "coming-soon") && (
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
            {tCommon("comingSoon")}
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-semibold leading-snug text-text group-hover:text-brand-light">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
    </div>
  );

  if (didactic) {
    const introTitle = t(`${project.slug}.introTitle`);
    const introBody = t(`${project.slug}.introBody`);
    const introContinue = t(`${project.slug}.introContinue`);
    const introClose = t(`${project.slug}.introClose`);

    return (
      <>
        <button
          type="button"
          onClick={() => setIntroOpen(true)}
          className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left card-shine transition-all duration-300"
        >
          {media}
          {body}
        </button>
        <ToolIntroDialog
          open={introOpen}
          title={introTitle}
          body={introBody}
          continueLabel={introContinue}
          closeLabel={introClose}
          onClose={() => setIntroOpen(false)}
          onContinue={() => {
            setIntroOpen(false);
            router.push(target);
          }}
        />
      </>
    );
  }

  return (
    <Link
      href={target}
      prefetch={false}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated card-shine transition-all duration-300"
    >
      {media}
      {body}
    </Link>
  );
}

type ShowcaseCardProps = {
  title: string;
  description: string;
  category: string;
  comingSoon?: boolean;
  href?: string;
  gradient?: string;
  initial?: string;
  id?: string;
  introTitle?: string;
  introBody?: string;
  introContinue?: string;
  introClose?: string;
};

/** Card no estilo ProjectCard para itens sem slug de projeto (ex.: converter). */
export function ShowcaseCard({
  title,
  description,
  category,
  comingSoon = true,
  href = "/contato",
  gradient = "from-emerald-900/20 to-surface-muted",
  initial,
  id,
  introTitle,
  introBody,
  introContinue,
  introClose,
}: ShowcaseCardProps) {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [introOpen, setIntroOpen] = useState(false);
  const letter = initial ?? category.charAt(0);
  const hasIntro = Boolean(introTitle && introBody && introContinue && introClose);

  const inner = (
    <>
      <div
        className={cn(
          "relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br",
          gradient,
        )}
      >
        <span className="font-display text-5xl font-bold text-brand/20 transition-colors group-hover:text-brand/40">
          {letter}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated/80 via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light">
            {category}
          </span>
          {comingSoon && (
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
              {tCommon("comingSoon")}
            </span>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug text-text group-hover:text-brand-light">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
      </div>
    </>
  );

  if (hasIntro) {
    return (
      <>
        <button
          type="button"
          id={id}
          onClick={() => setIntroOpen(true)}
          className="group flex h-full w-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left card-shine transition-all duration-300"
        >
          {inner}
        </button>
        <ToolIntroDialog
          open={introOpen}
          title={introTitle!}
          body={introBody!}
          continueLabel={introContinue!}
          closeLabel={introClose!}
          onClose={() => setIntroOpen(false)}
          onContinue={() => {
            setIntroOpen(false);
            router.push(href);
          }}
        />
      </>
    );
  }

  return (
    <Link
      id={id}
      href={href}
      prefetch={false}
      className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated card-shine transition-all duration-300"
    >
      {inner}
    </Link>
  );
}
