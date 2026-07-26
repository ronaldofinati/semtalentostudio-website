"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ToolIntroDialog } from "@/components/ToolIntroDialog";
import { useInteractiveTool } from "@/hooks/useInteractiveTool";
import { cn } from "@/lib/utils";

type QuimicaLabSectionProps = {
  className?: string;
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function QuimicaLabSection({
  className,
  forceOpen,
  onOpenChange,
}: QuimicaLabSectionProps) {
  const t = useTranslations("tools");
  const locale = useLocale();
  const [videoCollapsed, setVideoCollapsed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const {
    open,
    introOpen,
    requestOpen,
    dismissIntro,
    confirmOpen,
    closePanel,
  } = useInteractiveTool({
    hashId: "quimica-lab",
    forceOpen,
    onOpenChange,
  });

  const handleClose = () => {
    setVideoCollapsed(false);
    setTermsOpen(false);
    closePanel();
  };

  if (!open) {
    return (
      <>
        <button
          type="button"
          id="quimica-lab"
          onClick={requestOpen}
          className={cn(
            "group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left card-shine transition-all duration-300",
            "scroll-mt-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            className,
          )}
        >
          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-black">
            <video
              className="h-[82%] w-[82%] object-contain transition-transform duration-300 group-hover:scale-105"
              src="/projects/software/quimica-lab/quimica-lab.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-elevated/90 via-transparent to-transparent" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <span className="mb-2 w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light">
              {t("quimicaLab.tag")}
            </span>
            <h3 className="font-display text-lg font-semibold leading-snug text-text group-hover:text-brand-light">
              {t("quimicaLab.title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {t("quimicaLab.description")}
            </p>
          </div>
        </button>
        <ToolIntroDialog
          open={introOpen}
          title={t("quimicaLab.introTitle")}
          body={t("quimicaLab.introBody")}
          continueLabel={t("quimicaLab.introContinue")}
          closeLabel={t("quimicaLab.introClose")}
          onClose={dismissIntro}
          onContinue={confirmOpen}
        />
      </>
    );
  }

  return (
    <div
      id="quimica-lab"
      className={cn(
        "fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-surface",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface-elevated/95 px-3 py-2 backdrop-blur sm:px-4">
        <button
          type="button"
          onClick={handleClose}
          className="w-fit rounded-full border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-brand/40 hover:text-text"
        >
          {"\u2190"} {t("quimicaLab.back")}
        </button>
        <span className="hidden rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light sm:inline">
          {t("quimicaLab.tag")}
        </span>
        <h2 className="font-display truncate text-base font-semibold text-text sm:text-lg">
          {t("quimicaLab.title")}
        </h2>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#0a0a0a] p-2 sm:p-3 md:p-4">
        <div className="mx-auto h-full w-full max-w-[96%] overflow-hidden rounded-xl border border-border shadow-xl shadow-black/40">
          <iframe
            title={t("quimicaLab.title")}
            src={`/tools/quimica-lab/index.html?lang=${locale}`}
            className="block h-full w-full border-0"
            loading="lazy"
            allow="fullscreen"
          />
        </div>

        <aside
          className={cn(
            "absolute bottom-4 right-4 z-20 overflow-hidden rounded-xl border border-border bg-[#0a0a0a]/95 shadow-2xl shadow-black/50 backdrop-blur",
            "sm:bottom-5 sm:right-5",
            videoCollapsed ? "w-auto" : "w-[9.5rem] sm:w-[11.5rem]",
          )}
        >
          {videoCollapsed ? (
            <button
              type="button"
              onClick={() => setVideoCollapsed(false)}
              className="px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text"
            >
              {t("quimicaLab.videoGuide")}
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2 border-b border-border/60 px-2 py-1.5">
                <p className="text-[0.65rem] font-medium tracking-wide text-text-muted uppercase">
                  {t("quimicaLab.videoGuide")}
                </p>
                <button
                  type="button"
                  onClick={() => setVideoCollapsed(true)}
                  className="rounded px-1.5 text-xs text-text-muted hover:bg-surface-muted hover:text-text"
                  aria-label={t("quimicaLab.back")}
                >
                  {"\u2212"}
                </button>
              </div>
              <div className="bg-black p-1.5">
                <video
                  className="aspect-video w-full object-contain"
                  src="/projects/software/quimica-lab/quimica-lab.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={t("quimicaLab.videoGuide")}
                />
              </div>
            </>
          )}
        </aside>

        {termsOpen && (
          <div
            className="absolute inset-0 z-30 flex items-end justify-center bg-black/55 p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quimica-lab-terms-title"
          >
            <div className="max-h-[85%] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface-elevated p-5 shadow-2xl sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <h3
                  id="quimica-lab-terms-title"
                  className="font-display text-lg font-semibold text-text"
                >
                  {t("quimicaLab.termsTitle")}
                </h3>
                <button
                  type="button"
                  onClick={() => setTermsOpen(false)}
                  className="rounded-lg px-2 py-1 text-sm text-text-muted hover:bg-surface-muted hover:text-text"
                >
                  {"\u2715"}
                </button>
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-text-muted">
                <li>{t("quimicaLab.termsFree")}</li>
                <li>{t("quimicaLab.termsProprietary")}</li>
                <li>{t("quimicaLab.termsSponsor")}</li>
                <li>{t("quimicaLab.termsDesktop")}</li>
                <li>{t("quimicaLab.termsDisclaimer")}</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/contato?assunto=${encodeURIComponent(t("quimicaLab.contactSubjectSponsor"))}`}
                  className="rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-sm text-brand-light transition-colors hover:bg-brand/20"
                  onClick={() => setTermsOpen(false)}
                >
                  {t("quimicaLab.sponsorCta")}
                </Link>
                <Link
                  href={`/contato?assunto=${encodeURIComponent(t("quimicaLab.contactSubjectDesktop"))}`}
                  className="rounded-full border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-brand/40 hover:text-text"
                  onClick={() => setTermsOpen(false)}
                >
                  {t("quimicaLab.desktopCta")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t border-border bg-surface-elevated/95 px-3 py-2 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-[0.7rem] leading-snug text-text-muted sm:text-xs">
          {t("quimicaLab.freeNotice")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTermsOpen(true)}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-brand/40 hover:text-text"
          >
            {t("quimicaLab.termsCta")}
          </button>
          <Link
            href={`/contato?assunto=${encodeURIComponent(t("quimicaLab.contactSubjectSponsor"))}`}
            className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-xs text-brand-light transition-colors hover:bg-brand/20"
          >
            {t("quimicaLab.sponsorCta")}
          </Link>
          <Link
            href={`/contato?assunto=${encodeURIComponent(t("quimicaLab.contactSubjectDesktop"))}`}
            className="rounded-full border border-border px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-brand/40 hover:text-text"
          >
            {t("quimicaLab.desktopCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
