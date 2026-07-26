"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ToolIntroDialog } from "@/components/ToolIntroDialog";
import { useInteractiveTool } from "@/hooks/useInteractiveTool";
import { cn } from "@/lib/utils";

type SimuladorEducacionalSectionProps = {
  className?: string;
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SimuladorEducacionalSection({
  className,
  forceOpen,
  onOpenChange,
}: SimuladorEducacionalSectionProps) {
  const t = useTranslations("tools");
  const locale = useLocale();
  const {
    open,
    introOpen,
    requestOpen,
    dismissIntro,
    confirmOpen,
    closePanel,
  } = useInteractiveTool({
    hashId: "simulador-educacional",
    forceOpen,
    onOpenChange,
  });

  if (!open) {
    return (
      <>
        <button
          type="button"
          id="simulador-educacional"
          onClick={requestOpen}
          className={cn(
            "group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left card-shine transition-all duration-300",
            "scroll-mt-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            className,
          )}
        >
          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#1a100c]">
            <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/projects/software/simulador-educacional/cover.svg"
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 40vw"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-elevated/90 via-transparent to-transparent" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <span className="mb-2 w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light">
              {t("simuladorEducacional.tag")}
            </span>
            <h3 className="font-display text-lg font-semibold leading-snug text-text group-hover:text-brand-light">
              {t("simuladorEducacional.title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {t("simuladorEducacional.description")}
            </p>
          </div>
        </button>
        <ToolIntroDialog
          open={introOpen}
          title={t("simuladorEducacional.introTitle")}
          body={t("simuladorEducacional.introBody")}
          continueLabel={t("simuladorEducacional.introContinue")}
          closeLabel={t("simuladorEducacional.introClose")}
          onClose={dismissIntro}
          onContinue={confirmOpen}
        />
      </>
    );
  }

  return (
    <div
      id="simulador-educacional"
      className={cn(
        "fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-surface",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface-elevated/95 px-3 py-2 backdrop-blur sm:px-4">
        <button
          type="button"
          onClick={closePanel}
          className="w-fit rounded-full border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-brand/40 hover:text-text"
        >
          {"\u2190"} {t("simuladorEducacional.back")}
        </button>
        <span className="hidden rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light sm:inline">
          {t("simuladorEducacional.tag")}
        </span>
        <h2 className="font-display truncate text-base font-semibold text-text sm:text-lg">
          {t("simuladorEducacional.title")}
        </h2>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#120c09] p-2 sm:p-3 md:p-4">
        <div className="mx-auto h-full w-full max-w-[96%] overflow-hidden rounded-xl border border-border shadow-xl shadow-black/40">
          <iframe
            title={t("simuladorEducacional.title")}
            src={`/tools/simulador-educacional/index.html?lang=${locale}`}
            className="block h-full w-full border-0"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
