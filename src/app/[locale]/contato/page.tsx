import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/config/site";
import { isEmailConfigured } from "@/lib/email-config";

type Props = {
  params: Promise<{ locale: string }>;
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const emailEnabled = isEmailConfigured();
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface-elevated p-6">
              <h3 className="text-sm font-medium text-text">{t("channels.email")}</h3>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-2 block text-sm text-brand-light hover:underline"
              >
                {siteConfig.email}
              </a>
              {!emailEnabled && (
                <p className="mt-3 text-xs text-text-muted">{t("emailNote")}</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface-elevated p-6">
              <h3 className="text-sm font-medium text-text">{t("channels.whatsapp")}</h3>
              {siteConfig.whatsapp ? (
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.e164}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-medium text-brand-light transition-colors hover:border-brand hover:bg-brand/15"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  {t("whatsappCta")}
                </a>
              ) : (
                <p className="mt-2 text-sm text-text-muted">{t("whatsappNote")}</p>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-surface-elevated p-6">
              <h3 className="text-sm font-medium text-text">{t("channels.youtube")}</h3>
              <a
                href={siteConfig.youtube.channel}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm text-brand-light hover:underline"
              >
                {siteConfig.youtube.handle}
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Suspense fallback={null}>
            <ContactForm emailEnabled={emailEnabled} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}