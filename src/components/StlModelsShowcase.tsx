"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { stlCatalog, type StlModel } from "@/data/stl-catalog";
import { getStlDisplayTitle } from "@/data/stl-titles-pt";
import { features } from "@/config/features";
import { stlAssetUrl } from "@/lib/stl-assets";
import { cn } from "@/lib/utils";

type PriceFilter = "all" | "free" | "paid";

function fileNameFromPath(p: string) {
  try {
    return decodeURIComponent(p.split("/").pop() || p);
  } catch {
    return p.split("/").pop() || p;
  }
}

export function StlModelsShowcase() {
  const t = useTranslations("stlModels");
  const locale = useLocale();
  const filesLive = features.stlFilesPublished;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<PriceFilter>("all");
  const [selected, setSelected] = useState<StlModel | null>(null);
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({});
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [demoName, setDemoName] = useState("");
  const [demoEmail, setDemoEmail] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stlCatalog.filter((m) => {
      if (filter === "free" && m.priceUsd > 0) return false;
      if (filter === "paid" && m.priceUsd <= 0) return false;
      if (!q) return true;
      const displayTitle = getStlDisplayTitle(m.id, m.title, locale);
      return (
        displayTitle.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.author.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
      );
    });
  }, [query, filter, locale]);

  const isUnlocked = selected
    ? filesLive && (selected.priceUsd <= 0 || !!unlocked[selected.id])
    : false;

  function openModel(m: StlModel) {
    setSelected(m);
    setCheckoutOpen(false);
    setDemoName("");
    setDemoEmail("");
  }

  function closeDetail() {
    setSelected(null);
    setCheckoutOpen(false);
  }

  function confirmDemoPayment() {
    if (!selected || !filesLive) return;
    setUnlocked((prev) => ({ ...prev, [selected.id]: true }));
    setCheckoutOpen(false);
  }

  function titleOf(m: StlModel) {
    return getStlDisplayTitle(m.id, m.title, locale);
  }

  return (
    <section className="mt-12">
      {!filesLive ? (
        <p className="mb-6 rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-sm leading-relaxed text-text-muted">
          {t("filesComingSoon")}
        </p>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1">
          <label htmlFor="stl-search" className="sr-only">
            {t("search")}
          </label>
          <input
            id="stl-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("filterFree")}>
          {(
            [
              ["all", t("all")],
              ["free", t("filterFree")],
              ["paid", t("filterPaid")],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                filter === key
                  ? "bg-brand text-white"
                  : "bg-surface-elevated text-text-muted hover:text-text border border-border",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => openModel(m)}
                className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated text-left transition-colors hover:border-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
                  {filesLive && m.previewImage && stlAssetUrl(m.previewImage) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={stlAssetUrl(m.previewImage)!}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-muted to-surface">
                      <span className="font-display text-3xl text-text-muted/40">STL</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="font-display text-base font-semibold leading-snug text-text group-hover:text-brand-light">
                    {titleOf(m)}
                  </h3>
                  <p className="text-xs text-text-muted">{m.author}</p>
                  <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-400">
                      {t("license")}
                    </span>
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-text-muted">
                      {m.stlCount} STL
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        m.priceUsd > 0
                          ? "bg-amber-500/15 text-amber-300"
                          : "bg-brand/10 text-brand-light",
                      )}
                    >
                      {m.priceUsd > 0 ? `${t("usd")} ${m.priceUsd}` : t("free")}
                    </span>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="stl-detail-title"
          onClick={closeDetail}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="stl-detail-title" className="font-display text-xl font-semibold text-text">
                  {titleOf(selected)}
                </h2>
                <p className="mt-1 text-sm text-text-muted">{selected.author}</p>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-lg px-2 py-1 text-sm text-text-muted hover:text-text"
              >
                {t("close")}
              </button>
            </div>

            {filesLive && selected.previewImage && stlAssetUrl(selected.previewImage) && (
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stlAssetUrl(selected.previewImage)!}
                  alt=""
                  className="max-h-48 w-full object-cover"
                />
              </div>
            )}

            {selected.summary ? (
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{selected.summary}</p>
            ) : null}

            {!filesLive ? (
              <p className="mt-4 text-sm leading-relaxed text-text-muted">{t("filesComingSoon")}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-medium text-emerald-400">
                {t("license")} · CC0-1.0
              </span>
              <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-text-muted">
                {selected.stlCount} STL
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 font-medium",
                  selected.priceUsd > 0
                    ? "bg-amber-500/15 text-amber-300"
                    : "bg-brand/10 text-brand-light",
                )}
              >
                {selected.priceUsd > 0 ? `${t("usd")} ${selected.priceUsd}` : t("free")}
              </span>
            </div>

            {selected.sourceUrl ? (
              <p className="mt-4 text-sm">
                <a
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-light underline-offset-2 hover:underline"
                >
                  {t("source")}
                </a>
              </p>
            ) : null}

            <div className="mt-6">
              <h3 className="text-sm font-medium text-text">{t("files")}</h3>

              {!filesLive ? (
                <p className="mt-3 text-sm text-text-muted">{t("filesComingSoon")}</p>
              ) : selected.priceUsd > 0 && !isUnlocked ? (
                <div className="mt-3 rounded-xl border border-border bg-surface-elevated p-4">
                  <p className="text-sm text-text">
                    {t("usd")} {selected.priceUsd}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-text-muted">{t("demoCheckoutNote")}</p>
                  {!checkoutOpen ? (
                    <button
                      type="button"
                      onClick={() => setCheckoutOpen(true)}
                      className="mt-3 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
                    >
                      {t("buyDemo")}
                    </button>
                  ) : (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm font-medium text-text">{t("demoCheckoutTitle")}</p>
                      <input
                        type="text"
                        value={demoName}
                        onChange={(e) => setDemoName(e.target.value)}
                        placeholder="Name"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      />
                      <input
                        type="email"
                        value={demoEmail}
                        onChange={(e) => setDemoEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
                      />
                      <button
                        type="button"
                        onClick={confirmDemoPayment}
                        className="w-full rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand/90"
                      >
                        {t("confirmDemo")}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {selected.priceUsd > 0 && isUnlocked ? (
                    <p className="mt-2 text-xs text-emerald-400">{t("unlockDemo")}</p>
                  ) : null}
                  <ul className="mt-3 space-y-2">
                    {selected.stlFiles.map((file) => {
                      const href = stlAssetUrl(file) ?? file;
                      return (
                      <li key={file}>
                        <a
                          href={href}
                          download={fileNameFromPath(file)}
                          className="block rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-brand-light transition-colors hover:border-brand/40"
                        >
                          {t("download")}: {fileNameFromPath(file)}
                        </a>
                      </li>
                      );
                    })}
                    {selected.stlFiles.length === 0 ? (
                      <li className="text-sm text-text-muted">{t("empty")}</li>
                    ) : null}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}