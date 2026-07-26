"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CardImageSlideshow } from "@/components/CardImageSlideshow";
import { EDUCATION_HOME_SLIDES } from "@/data/project-media";

export function HomeEducationSection() {
  const t = useTranslations("home.education");

  return (
    <section className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(200,169,110,0.08)_0%,_transparent_55%)]" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface-muted shadow-[0_20px_60px_-30px_rgba(0,0,0,0.65)]">
            <div className="relative aspect-[3/2] w-full">
              <CardImageSlideshow
                images={EDUCATION_HOME_SLIDES}
                alt={t("title")}
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/35 via-transparent to-transparent" />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-base text-brand-light/90 sm:text-lg">
              {t("subtitle")}
            </p>
            <p className="mt-6 text-base leading-relaxed text-text-muted sm:text-lg">
              {t("body1")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
              {t("body2")}
            </p>
            <div className="mt-8">
              <Link
                href="/educacao"
                prefetch={false}
                className="inline-flex rounded-full bg-gradient-to-r from-accent to-accent-soft px-6 py-3 text-sm font-medium text-surface shadow-lg shadow-accent/20 transition-all hover:brightness-105"
              >
                {t("cta")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}