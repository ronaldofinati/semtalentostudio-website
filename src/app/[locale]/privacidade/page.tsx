import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/config/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}

function PrivacyContent() {
  const t = useTranslations("privacy");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="space-y-6 text-base leading-relaxed text-text-muted">
        <p>{t("intro")}</p>
        <section>
          <h2 className="font-display text-xl font-semibold text-text">{t("collectTitle")}</h2>
          <p className="mt-2">{t("collectBody")}</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-text">{t("toolsTitle")}</h2>
          <p className="mt-2">{t("toolsBody")}</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-semibold text-text">{t("contactTitle")}</h2>
          <p className="mt-2">
            {t("contactBody")}{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-brand-light hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </section>
        <p className="text-sm">
          <Link href="/contato" className="text-brand-light hover:underline">
            {t("contactLink")}
          </Link>
        </p>
      </div>
    </div>
  );
}