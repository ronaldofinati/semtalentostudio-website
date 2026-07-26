import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { StudioPresentation } from "@/components/StudioPresentation";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { SectionHeader } from "@/components/SectionHeader";
import { ProjectCard } from "@/components/ProjectCard";
import { CardImageSlideshow } from "@/components/CardImageSlideshow";
import { HomeEducationSection } from "@/components/HomeEducationSection";
import { getFeaturedProjects } from "@/data/projects";
import { TOOLS_CARD_SLIDES } from "@/data/project-media";
import { cn } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common");
  const featured = getFeaturedProjects();

  return (
    <>
      <section className="relative overflow-visible border-b border-border/80 pb-6 sm:pb-10">
        <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,_#161616_0%,_#0a0a0a_65%)]" />
        <div className="hero-glow pointer-events-none absolute left-1/2 top-[28%] h-[min(32rem,80vw)] w-[min(32rem,80vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:px-8 lg:pt-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className="hero-glow absolute inset-0 scale-150 rounded-full blur-2xl" />
              <Logo variant="hero" showText={false} className="relative justify-center" />
            </div>
            <h1 className="font-display max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-b from-text via-text to-brand-light bg-clip-text text-transparent">
                {t("hero.tagline")}
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-muted sm:text-xl">
              {t("hero.subtitle")}
            </p>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted/90 sm:text-lg">
              {t("hero.description")}
            </p>
            <div className="relative z-30 mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/projetos" size="lg">
                {tCommon("ctaDesign")}
              </Button>
              <Button href="/ferramentas" variant="secondary" size="lg">
                {tCommon("ctaTools")}
              </Button>
              <Button href="/educacao" variant="secondary" size="lg">
                {tCommon("ctaEducation")}
              </Button>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <StudioPresentation />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <SectionHeader
          title={t("featured.title")}
          subtitle={t("featured.subtitle")}
        />
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}

          <Link
            href="/ferramentas"
            prefetch={false}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated card-shine transition-all duration-300"
          >
            <div
              className={cn(
                "relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br",
                "from-emerald-900/25 to-surface-muted",
              )}
            >
              <CardImageSlideshow
                images={TOOLS_CARD_SLIDES}
                alt={t("tools.card.title")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated/80 via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <span className="mb-2 w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light">
                {t("tools.card.tag")}
              </span>
              <h3 className="font-display text-lg font-semibold leading-snug text-text group-hover:text-brand-light">
                {t("tools.card.title")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {t("tools.card.description")}
              </p>
            </div>
          </Link>
        </div>
      </section>

      <HomeEducationSection />

      <section className="border-t border-border bg-surface-elevated">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="accent-line mx-auto mb-8" />
          <Button
            href="/contato"
            size="lg"
            className="font-display px-8 py-3.5 text-xl font-semibold tracking-tight sm:px-11 sm:py-4 sm:text-2xl lg:text-3xl"
          >
            {t("cta.title")}
          </Button>
        </div>
      </section>
    </>
  );
}
