import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";

type Props = {
  params: Promise<{ locale: string }>;
};

const PILLARS = ["extract", "unite", "transform"] as const;
const FIELDS = ["footwear", "product", "3d", "web", "software", "education"] as const;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");
  const tCommon = useTranslations("common");

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="space-y-4 text-lg leading-relaxed text-text-muted">
        <p className="text-xl text-text">{t("intro.lead")}</p>
        <p>{t("intro.body")}</p>
      </div>

      <section className="mt-14 rounded-2xl border border-border bg-surface-elevated p-8 sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-text">{t("origin.title")}</h2>
        <p className="mt-4 leading-relaxed text-text-muted">{t("origin.body")}</p>
        <ul className="mt-4 space-y-2 pl-1 text-text-muted">
          <li className="flex items-start gap-3">
            <span className="mt-2 h-1 w-4 shrink-0 bg-accent/80" aria-hidden />
            {t("origin.question1")}
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-2 h-1 w-4 shrink-0 bg-accent/80" aria-hidden />
            {t("origin.question2")}
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-text">{t("pillars.title")}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {PILLARS.map((key) => (
            <li
              key={key}
              className="rounded-2xl border border-border bg-surface-elevated p-6"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-accent">
                {t(`pillars.${key}.label`)}
              </span>
              <h3 className="font-display mt-2 text-lg font-semibold text-text">
                {t(`pillars.${key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {t(`pillars.${key}.description`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 rounded-2xl border border-border bg-surface-elevated p-8 sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-text">{t("fields.title")}</h2>
        <p className="mt-3 text-text-muted">{t("fields.subtitle")}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {FIELDS.map((key) => (
            <li
              key={key}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface px-4 py-3 text-sm text-text-muted"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {t(`fields.${key}`)}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-surface-elevated p-8 sm:p-10">
        <h2 className="font-display text-2xl font-semibold text-text">
          {t("educationRole.title")}
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-text-muted">
          <p>{t("educationRole.body1")}</p>
          <p>{t("educationRole.body2")}</p>
        </div>
        <Link
          href="/educacao"
          className="mt-6 inline-flex items-center text-sm font-medium text-brand-light transition-colors hover:text-text"
        >
          {t("educationRole.cta")} →
        </Link>
      </section>

      <section className="mt-10 space-y-4 leading-relaxed text-text-muted">
        <h2 className="font-display text-2xl font-semibold text-text">{t("philosophy.title")}</h2>
        <p>{t("philosophy.p1")}</p>
        <p>{t("philosophy.p2")}</p>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-surface-elevated p-8">
        <h2 className="font-display text-xl font-semibold text-text">{t("company.title")}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="text-text-muted">{t("company.name")}</dt>
          </div>
          <div>
            <dd className="text-text">{t("company.activity")}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <Button href="/projetos">{tCommon("viewProjects")}</Button>
        <Link
          href="/contato"
          className="inline-flex items-center text-sm text-text-muted transition-colors hover:text-text"
        >
          {tCommon("getInTouch")} →
        </Link>
      </div>
    </div>
  );
}
