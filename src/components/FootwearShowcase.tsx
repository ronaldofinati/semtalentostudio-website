"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

export type FootwearProduct = {
  id: string;
  title: string;
  tag: string;
  description: string;
  layout?: "standard" | "pair" | "collection";
  ctaHref?: string;
};

type FootwearShowcaseProps = {
  title: string;
  subtitle: string;
  products: FootwearProduct[];
  imagesById: Record<string, readonly string[]>;
};

type LightboxProps = {
  images: readonly string[];
  index: number;
  title: string;
  onClose: () => void;
  onChange: (index: number) => void;
};

function ImageLightbox({ images, index, title, onClose, onChange }: LightboxProps) {
  const t = useTranslations("common");
  const hasMultiple = images.length > 1;

  const go = useCallback(
    (delta: number) => {
      onChange((index + delta + images.length) % images.length);
    },
    [images.length, index, onChange],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [go, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={t("zoomImage")}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-xl text-text transition-colors hover:border-accent/40 hover:bg-black/80"
        aria-label={t("closeZoom")}
      >
        ×
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-xl text-text transition-colors hover:border-accent/40 hover:bg-black/80 sm:left-6"
            aria-label={t("previousImage")}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-xl text-text transition-colors hover:border-accent/40 hover:bg-black/80 sm:right-6"
            aria-label={t("nextImage")}
          >
            ›
          </button>
        </>
      )}

      <div
        className="relative h-[min(85vh,900px)] w-full max-w-6xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={title}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>

      {hasMultiple && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-text-muted">
          {index + 1} / {images.length}
        </p>
      )}
    </div>
  );
}

function ProductCard({
  product,
  images,
}: {
  product: FootwearProduct;
  images: readonly string[];
}) {
  const t = useTranslations("common");
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasMultiple = images.length > 1;

  const go = (delta: number) => {
    setIndex((current) => (current + delta + images.length) % images.length);
  };

  return (
    <article className="card-shine overflow-hidden rounded-2xl border border-border bg-surface-elevated">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0d0d0d]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group absolute inset-0 z-0 cursor-zoom-in"
          aria-label={t("zoomImage")}
        >
          <Image
            src={images[index]}
            alt={product.title}
            fill
            className="object-contain p-4 transition-opacity duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
          <span className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-xs text-text-muted opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            {t("zoomHint")}
          </span>
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-lg text-text backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-black/70"
              aria-label={t("previousImage")}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-lg text-text backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-black/70"
              aria-label={t("nextImage")}
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-5 bg-accent" : "w-1.5 bg-white/30 hover:bg-white/50",
                  )}
                  aria-label={`${t("nextImage")} ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />
      </div>

      {hasMultiple && images.length <= 7 && (
        <div className="flex gap-2 overflow-x-auto border-t border-border/60 bg-surface px-3 py-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                setIndex(i);
                setLightboxOpen(true);
              }}
              className={cn(
                "relative h-12 w-16 shrink-0 cursor-zoom-in overflow-hidden rounded-md border transition-all",
                i === index
                  ? "border-accent ring-1 ring-accent/30"
                  : "border-border opacity-70 hover:opacity-100",
              )}
              aria-label={`${t("zoomImage")} ${i + 1}`}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      <div className="p-5">
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
          {product.tag}
        </span>
        <h3 className="font-display mt-3 text-lg font-semibold text-text">{product.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{product.description}</p>
        {product.ctaHref && (
          <div className="mt-4">
            <Button href={product.ctaHref} size="sm">
              {t("learnMore")}
            </Button>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          index={index}
          title={product.title}
          onClose={() => setLightboxOpen(false)}
          onChange={setIndex}
        />
      )}
    </article>
  );
}

function CollectionProductCard({
  product,
  images,
}: {
  product: FootwearProduct;
  images: readonly string[];
}) {
  const t = useTranslations("common");
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbnails = images.slice(1);

  return (
    <article className="card-shine overflow-hidden rounded-2xl border border-border bg-surface-elevated">
      <div className="relative aspect-[21/10] w-full overflow-hidden bg-[#12100f]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group absolute inset-0 cursor-zoom-in"
          aria-label={t("zoomImage")}
        >
          <Image
            src={images[index]}
            alt={product.title}
            fill
            className="object-contain p-3 transition-opacity duration-300 sm:p-5"
            sizes="100vw"
            priority
          />
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-xs text-text-muted opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            {t("zoomHint")}
          </span>
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#12100f] to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border/60 bg-surface p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
        {thumbnails.map((src, i) => {
          const imageIndex = i + 1;

          return (
            <button
              key={src}
              type="button"
              onClick={() => {
                setIndex(imageIndex);
                setLightboxOpen(true);
              }}
              className={cn(
                "group/tile flex flex-col gap-2 text-left transition-all",
                imageIndex === index && "opacity-100",
                imageIndex !== index && "opacity-75 hover:opacity-100",
              )}
            >
              <div
                className={cn(
                  "relative aspect-[5/4] w-full overflow-hidden rounded-xl border bg-[#0d0d0d] transition-all",
                  imageIndex === index
                    ? "border-accent ring-1 ring-accent/30"
                    : "border-border group-hover/tile:border-brand/30",
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border/60 p-5 sm:p-6">
        <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-medium text-amber-100/90">
          {product.tag}
        </span>
        <h3 className="font-display mt-3 text-xl font-semibold text-text sm:text-2xl">
          {product.title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">
          {product.description}
        </p>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          index={index}
          title={product.title}
          onClose={() => setLightboxOpen(false)}
          onChange={setIndex}
        />
      )}
    </article>
  );
}

function PairProductCard({
  product,
  images,
}: {
  product: FootwearProduct;
  images: readonly string[];
}) {
  const t = useTranslations("common");
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <article className="card-shine overflow-hidden rounded-2xl border border-border bg-surface-elevated">
      <div className="relative aspect-[21/10] w-full overflow-hidden bg-[#12100f]">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group absolute inset-0 cursor-zoom-in"
          aria-label={t("zoomImage")}
        >
          <Image
            src={images[index]}
            alt={product.title}
            fill
            className="object-contain p-3 transition-opacity duration-300 sm:p-5"
            sizes="100vw"
            priority
          />
          <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 text-xs text-text-muted opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            {t("zoomHint")}
          </span>
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#12100f] to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-border/60 bg-surface p-3 sm:grid-cols-4 sm:gap-3 sm:p-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setIndex(i);
              setLightboxOpen(true);
            }}
            className={cn(
              "group/tile flex flex-col gap-2 text-left transition-all",
              i === index && "opacity-100",
              i !== index && "opacity-75 hover:opacity-100",
            )}
          >
            <div
              className={cn(
                "relative aspect-[5/4] w-full overflow-hidden rounded-xl border bg-[#0d0d0d] transition-all",
                i === index
                  ? "border-accent ring-1 ring-accent/30"
                  : "border-border group-hover/tile:border-brand/30",
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
            </div>
          </button>
        ))}
      </div>

      <div className="border-t border-border/60 p-5 sm:p-6">
        <span className="rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-medium text-pink-200/90">
          {product.tag}
        </span>
        <h3 className="font-display mt-3 text-xl font-semibold text-text sm:text-2xl">
          {product.title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">
          {product.description}
        </p>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          index={index}
          title={product.title}
          onClose={() => setLightboxOpen(false)}
          onChange={setIndex}
        />
      )}
    </article>
  );
}

export function FootwearShowcase({
  title,
  subtitle,
  products,
  imagesById,
}: FootwearShowcaseProps) {
  return (
    <section className="mt-12 space-y-8">
      <div>
        <h2 className="font-display text-xl font-semibold text-text">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-muted">{subtitle}</p>
        <div className="accent-line mt-4" />
      </div>

      <ul className="grid gap-8 lg:grid-cols-2">
        {products.map((product) => {
          const images = imagesById[product.id];
          if (!images?.length) return null;

          return (
            <li
              key={product.id}
              className={cn(
                (product.layout === "pair" || product.layout === "collection") && "lg:col-span-2",
              )}
            >
              {product.layout === "pair" ? (
                <PairProductCard product={product} images={images} />
              ) : product.layout === "collection" ? (
                <CollectionProductCard product={product} images={images} />
              ) : (
                <ProductCard product={product} images={images} />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
