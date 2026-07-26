"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ToolIntroDialog } from "@/components/ToolIntroDialog";
import { useInteractiveTool } from "@/hooks/useInteractiveTool";
import { cn } from "@/lib/utils";

type SizeGuideSectionProps = {
  className?: string;
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SizeGuideSection({
  className,
  forceOpen,
  onOpenChange,
}: SizeGuideSectionProps) {
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
    hashId: "size-guide",
    forceOpen,
    onOpenChange,
  });

  useEffect(() => {
    if (!open) return;
    const el = document.getElementById("size-guide");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [open]);

  if (!open) {
    return (
      <>
        <button
          type="button"
          id="size-guide"
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
              src="/projects/footwear/size-guide.mp4"
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
              {t("sizeGuide.tag")}
            </span>
            <h3 className="font-display text-lg font-semibold leading-snug text-text group-hover:text-brand-light">
              {t("sizeGuide.title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {t("sizeGuide.description")}
            </p>
          </div>
        </button>
        <ToolIntroDialog
          open={introOpen}
          title={t("sizeGuide.introTitle")}
          body={t("sizeGuide.introBody")}
          continueLabel={t("sizeGuide.introContinue")}
          closeLabel={t("sizeGuide.introClose")}
          onClose={dismissIntro}
          onContinue={confirmOpen}
        />
      </>
    );
  }

  return (
    <div
      id="size-guide"
      className={cn(
        "scroll-mt-24 rounded-2xl border border-border bg-surface-elevated p-6 sm:p-10",
        className,
      )}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={closePanel}
          className="w-fit rounded-full border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-brand/40 hover:text-text"
        >
          {"\u2190"} {t("sizeGuide.back")}
        </button>
        <span className="w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light sm:order-first">
          {t("sizeGuide.tag")}
        </span>
      </div>

      <h2 className="font-display text-center text-2xl font-semibold text-text sm:text-3xl">
        {t("sizeGuide.title")}
      </h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-text-muted">
        {t("sizeGuide.description")}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:justify-center">
        <div className="w-full max-w-[34rem] overflow-visible rounded-xl border border-border bg-[#0a0a0a] shadow-xl shadow-black/40">
          <iframe
            title={t("sizeGuide.title")}
            src={"/tools/size-guide/index.html#/?embed=1&lang=" + locale}
            className="block h-[34rem] w-full border-0"
            loading="lazy"
          />
        </div>

        <aside className="flex w-full max-w-[18rem] flex-col overflow-hidden rounded-xl border border-border bg-[#0a0a0a] shadow-xl shadow-black/40">
          <p className="border-b border-border/60 px-3 py-2 text-center text-xs font-medium tracking-wide text-text-muted uppercase">
            {t("sizeGuide.videoGuide")}
          </p>
          <div className="relative flex flex-1 items-center justify-center bg-black">
            <video
              className="h-full max-h-[32rem] w-full object-contain"
              src="/projects/footwear/size-guide.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={t("sizeGuide.videoGuide")}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
