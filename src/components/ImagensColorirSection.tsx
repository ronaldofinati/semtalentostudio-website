"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ToolIntroDialog } from "@/components/ToolIntroDialog";
import { useInteractiveTool } from "@/hooks/useInteractiveTool";
import {
  colorirCategories,
  colorirPages,
  type ColorirCategory,
  type ColorirMode,
  type ColorirPage,
} from "@/data/colorir-catalog";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 24;

type ImagensColorirSectionProps = {
  className?: string;
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function printPage(page: ColorirPage, title: string) {
  const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");
  if (!w) return;
  const src =
    page.mode === "draw" ? `${page.file}?v=completar-colorir` : page.file;
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
<style>
  html,body{margin:0;padding:0;background:#fff;}
  .wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:12px;box-sizing:border-box;}
  img{max-width:100%;max-height:100vh;width:auto;height:auto;}
  @media print{
    html,body{margin:0;background:#fff;}
    .wrap{padding:0;min-height:auto;}
    img{width:100%;height:auto;max-height:none;}
  }
</style></head><body><div class="wrap"><img src="${src}" alt="${title}"/></div>
<script>window.onload=function(){window.focus();window.print();}</script>
</body></html>`);
  w.document.close();
}

export function ImagensColorirSection({
  className,
  forceOpen,
  onOpenChange,
}: ImagensColorirSectionProps) {
  const t = useTranslations("tools.imagensColorir");
  const {
    open,
    introOpen,
    requestOpen,
    dismissIntro,
    confirmOpen,
    closePanel,
  } = useInteractiveTool({
    hashId: "imagens-colorir",
    forceOpen,
    onOpenChange,
  });

  const [mode, setMode] = useState<"all" | ColorirMode>("all");
  const [category, setCategory] = useState<"all" | ColorirCategory>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return colorirPages.filter((p) => {
      if (mode !== "all" && p.mode !== mode) return false;
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.titlePt.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.mode.toLowerCase().includes(q)
      );
    });
  }, [mode, category, query]);

  const shown = filtered.slice(0, visible);

  const modeButtons: Array<"all" | ColorirMode> = ["all", "draw", "color"];

  if (!open) {
    return (
      <>
        <button
          type="button"
          id="imagens-colorir"
          onClick={requestOpen}
          className={cn(
            "group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left card-shine transition-all duration-300",
            "scroll-mt-24 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            className,
          )}
        >
          <div className="relative flex h-48 items-center justify-center overflow-hidden bg-[#1a1410]">
            <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/projects/software/imagens-colorir/cover.svg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface-elevated/90 via-transparent to-transparent" />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <span className="mb-2 w-fit rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light">
              {t("tag")}
            </span>
            <h3 className="font-display text-lg font-semibold leading-snug text-text group-hover:text-brand-light">
              {t("title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              {t("description")}
            </p>
          </div>
        </button>
        <ToolIntroDialog
          open={introOpen}
          title={t("introTitle")}
          body={t("introBody")}
          continueLabel={t("introContinue")}
          closeLabel={t("introClose")}
          onClose={dismissIntro}
          onContinue={confirmOpen}
        />
      </>
    );
  }

  return (
    <div
      id="imagens-colorir"
      className={cn(
        "fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-surface",
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border bg-surface-elevated/95 px-3 py-2 backdrop-blur sm:px-4">
        <button
          type="button"
          onClick={closePanel}
          className="w-fit rounded-full border border-border px-3 py-1.5 text-sm text-text-muted transition-colors hover:border-brand/40 hover:text-text"
        >
          {"\u2190"} {t("back")}
        </button>
        <span className="hidden rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand-light sm:inline">
          {t("tag")}
        </span>
        <h2 className="font-display truncate text-base font-semibold text-text sm:text-lg">
          {t("title")}
        </h2>
        <p className="ml-auto hidden text-xs text-text-muted md:block">{t("licenseNote")}</p>
      </div>

      <div className="shrink-0 space-y-3 border-b border-border bg-surface px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-sm text-text placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:max-w-sm"
          />
          <p className="text-xs text-text-muted sm:ml-auto md:hidden">{t("licenseNote")}</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {modeButtons.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                mode === m
                  ? "border-brand/50 bg-brand/15 text-brand-light"
                  : "border-border text-text-muted hover:border-brand/30 hover:text-text",
              )}
            >
              {m === "all" ? t("filterAll") : t(`modes.${m}`)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              setVisible(PAGE_SIZE);
            }}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
              category === "all"
                ? "border-brand/50 bg-brand/15 text-brand-light"
                : "border-border text-text-muted hover:border-brand/30 hover:text-text",
            )}
          >
            {t("filterAllCategories")}
          </button>
          {colorirCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs transition-colors",
                category === cat
                  ? "border-brand/50 bg-brand/15 text-brand-light"
                  : "border-border text-text-muted hover:border-brand/30 hover:text-text",
              )}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4">
        {shown.length === 0 ? (
          <p className="py-16 text-center text-sm text-text-muted">{t("empty")}</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {shown.map((page) => (
                <article
                  key={page.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface-elevated"
                >
                  <div className="relative aspect-[794/1123] bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        page.mode === "draw"
                          ? `${page.file}?v=completar-colorir`
                          : page.file
                      }
                      alt={page.titlePt}
                      className="h-full w-full object-contain p-2"
                      loading="lazy"
                    />
                    <span
                      className={cn(
                        "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium",
                        page.mode === "draw"
                          ? "bg-amber-100 text-amber-900"
                          : "bg-sky-100 text-sky-900",
                      )}
                    >
                      {t(`modes.${page.mode}`)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-2.5">
                    <h3 className="line-clamp-2 text-xs font-medium leading-snug text-text">
                      {page.titlePt}
                    </h3>
                    <div className="mt-auto flex flex-wrap gap-1.5">
                      <a
                        href={page.file}
                        download={page.file.split("/").pop() ?? page.id}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:border-brand/40 hover:text-text"
                      >
                        {t("download")}
                      </a>
                      <button
                        type="button"
                        onClick={() => printPage(page, page.titlePt)}
                        className="rounded-full border border-border px-2.5 py-1 text-[11px] text-text-muted transition-colors hover:border-brand/40 hover:text-text"
                      >
                        {t("print")}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {visible < filtered.length ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="rounded-full border border-border px-4 py-2 text-sm text-text-muted transition-colors hover:border-brand/40 hover:text-text"
                >
                  {t("loadMore")} ({shown.length}/{filtered.length})
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
