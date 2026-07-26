"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  STUDIO_PRESENTATION_AUDIO,
  STUDIO_PRESENTATION_CATEGORY_HREF,
  STUDIO_PRESENTATION_SLIDES,
  getStudioPresentationSlideDurationMs,
  type StudioPresentationSlideId,
  type StudioPresentationSlideLayout,
} from "@/data/studio-presentation";
import { Logo } from "@/components/Logo";

function SlideStage({
  index,
  playing,
  reduceMotion,
  compact = false,
}: {
  index: number;
  playing: boolean;
  reduceMotion: boolean;
  compact?: boolean;
}) {
  const t = useTranslations("home.presentation");
  const slide = STUDIO_PRESENTATION_SLIDES[index];
  const slideId = slide.id as StudioPresentationSlideId;
  const layout = slide.layout as StudioPresentationSlideLayout;
  const isCentered = layout === "center" || layout === "outro";
  const isOutro = layout === "outro";

  return (
    <>
      <div
        className={cn(
          "relative w-full",
          compact ? "aspect-[16/10]" : "aspect-[16/9] sm:aspect-[21/9]",
        )}
      >
        {STUDIO_PRESENTATION_SLIDES.map((item, i) => {
          const active = i === index;
          const hasImage = item.image !== null;

          return (
            <div
              key={item.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                active ? "opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={!active}
            >
              {hasImage ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className={cn(
                    "object-cover",
                    active && playing && !reduceMotion && "animate-presentation-zoom",
                  )}
                  sizes={compact ? "352px" : "(max-width: 1024px) 100vw, 1024px"}
                  priority={i === 0}
                  unoptimized={typeof item.image === "string" && /\.svg($|\?)/i.test(item.image)}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#1a1816_0%,_#0a0a0a_70%)]" />
              )}
              <div
                className={cn(
                  "absolute inset-0",
                  item.layout === "center" || item.layout === "outro"
                    ? "bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.35)_0%,_rgba(0,0,0,0.55)_100%)]"
                    : "bg-gradient-to-t from-black/90 via-black/40 to-black/25",
                )}
              />
            </div>
          );
        })}

        {slide.category ? (
          <Link
            href={STUDIO_PRESENTATION_CATEGORY_HREF[slide.category]}
            prefetch={false}
            className={cn(
              "absolute z-20 rounded-full border border-white/25 bg-black/55 font-medium uppercase tracking-[0.14em] text-accent backdrop-blur-md transition-colors hover:border-accent/50 hover:bg-black/70 hover:text-accent",
              compact
                ? "left-2 top-2 px-2 py-0.5 text-[9px]"
                : "left-4 top-4 px-3 py-1.5 text-[11px] sm:left-6 sm:top-6 sm:text-xs",
            )}
          >
            {t(`categories.${slide.category}`)}
          </Link>
        ) : null}

        <div
          className={cn(
            "relative z-10 flex h-full flex-col",
            compact ? "p-3" : "p-6 sm:p-10",
            isCentered ? "items-center justify-center text-center" : "justify-end",
          )}
        >
          <p
            className={cn(
              "font-medium uppercase tracking-[0.2em] text-accent",
              compact ? "text-[10px]" : "text-xs",
              isCentered && !compact && "absolute right-6 top-6 sm:right-10 sm:top-10",
              !isCentered && slide.category && (compact ? "mt-5" : "mt-2"),
            )}
          >
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(STUDIO_PRESENTATION_SLIDES.length).padStart(2, "0")}
          </p>

          {isOutro && !compact ? (
            <Link
              href="/contato"
              prefetch={false}
              className="-mt-2 flex flex-col items-center outline-none transition-opacity hover:opacity-90 focus-visible:opacity-90"
              aria-label={t("slides.cta.title")}
            >
              <Logo
                variant="hero"
                showText={false}
                className="pointer-events-none scale-[0.45] sm:scale-[0.55] lg:scale-[0.6]"
              />
            </Link>
          ) : isCentered && !compact ? (
            <Link
              href="/contato"
              prefetch={false}
              className="mx-auto block max-w-2xl outline-none transition-opacity hover:opacity-90 focus-visible:opacity-90"
            >
              <h3 className="font-display mt-2 text-2xl font-semibold text-text sm:text-3xl lg:text-4xl">
                {t(`slides.${slideId}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted sm:text-base lg:text-lg">
                {t(`slides.${slideId}.caption`)}
              </p>
            </Link>
          ) : (
            <>
              <h3
                className={cn(
                  "font-display mt-2 font-semibold text-text",
                  compact
                    ? "line-clamp-2 text-sm"
                    : cn(
                        "max-w-2xl text-2xl sm:text-3xl lg:text-4xl",
                        isCentered && "mx-auto",
                      ),
                )}
              >
                {t(`slides.${slideId}.title`)}
              </h3>
              {!compact && (
                <p
                  className={cn(
                    "mt-3 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base lg:text-lg",
                    isCentered && "mx-auto",
                  )}
                >
                  {t(`slides.${slideId}.caption`)}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export function StudioPresentation() {
  const t = useTranslations("home.presentation");
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [dockedDismissed, setDockedDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const slideId = STUDIO_PRESENTATION_SLIDES[index].id as StudioPresentationSlideId;

  useEffect(() => {
    setIsExpanded(false);
    setIsDocked(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduceMotion(prefersReduced);
    if (prefersReduced) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || reduceMotion) return;

    const currentSlide = STUDIO_PRESENTATION_SLIDES[index];
    const duration = getStudioPresentationSlideDurationMs(
      currentSlide.id as StudioPresentationSlideId,
    );

    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % STUDIO_PRESENTATION_SLIDES.length);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [playing, reduceMotion, index]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDockedDismissed(false);
          setIsDocked(false);
          setIsExpanded(false);
        } else if (playing && !dockedDismissed) {
          setIsDocked(true);
        } else {
          setIsDocked(false);
        }
      },
      { threshold: 0.15, rootMargin: "-80px 0px 0px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [playing, dockedDismissed]);

  useEffect(() => {
    if (!isExpanded) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isExpanded]);

  const unlockAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !musicOn || reduceMotion || !playing) return;

    audio.muted = false;
    audio.volume = STUDIO_PRESENTATION_AUDIO.volume;
    try {
      if (audio.paused) {
        await audio.play();
      }
      setAudioBlocked(false);
    } catch {
      setAudioBlocked(true);
    }
  }, [musicOn, reduceMotion, playing]);

  const syncAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !playing || !musicOn || reduceMotion) {
      audio?.pause();
      return;
    }

    audio.volume = STUDIO_PRESENTATION_AUDIO.volume;
    audio.muted = false;
    try {
      await audio.play();
      setAudioBlocked(false);
      return;
    } catch {
      // Navegadores bloqueiam autoplay com som — inicia mudo e desmuta no 1º gesto.
      try {
        audio.muted = true;
        await audio.play();
        setAudioBlocked(true);
      } catch {
        audio.pause();
        setAudioBlocked(true);
      }
    }
  }, [playing, musicOn, reduceMotion]);

  useEffect(() => {
    void syncAudio();
  }, [syncAudio, index]);

  useEffect(() => {
    if (!audioBlocked || !musicOn) return;

    const onGesture = () => {
      void unlockAudio();
    };

    window.addEventListener("pointerdown", onGesture, { once: true, passive: true });
    window.addEventListener("keydown", onGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
  }, [audioBlocked, musicOn, unlockAudio]);

  const goTo = useCallback((next: number) => {
    setIndex((next + STUDIO_PRESENTATION_SLIDES.length) % STUDIO_PRESENTATION_SLIDES.length);
  }, []);

  const togglePlayback = () => setPlaying((value) => !value);

  const toggleMusic = () => {
    if (audioBlocked) {
      void unlockAudio();
      return;
    }
    setMusicOn((value) => !value);
  };

  const dismissDocked = () => {
    setDockedDismissed(true);
    setIsExpanded(false);
    setIsDocked(false);
  };

  const openExpanded = () => setIsExpanded(true);
  const closeExpanded = () => setIsExpanded(false);

  const musicAudible = musicOn && !audioBlocked;

  const controls = (
    <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-surface/95 px-3 py-2.5 backdrop-blur-sm sm:px-5">
      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
        {STUDIO_PRESENTATION_SLIDES.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 shrink-0 rounded-full transition-all",
              i === index ? "w-8 bg-accent" : "w-3 bg-white/20 hover:bg-white/40",
            )}
            aria-label={`${t("goToSlide")} ${i + 1}`}
          />
        ))}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={toggleMusic}
          className={cn(
            "flex h-8 items-center justify-center rounded-full border px-2.5 text-xs transition-colors",
            musicAudible
              ? "border-accent/40 text-accent"
              : musicOn && audioBlocked
                ? "border-amber-500/40 text-amber-400"
                : "border-border text-text-muted hover:border-brand/40",
          )}
          aria-label={
            audioBlocked && musicOn
              ? t("enableSound")
              : musicOn
                ? t("muteMusic")
                : t("unmuteMusic")
          }
          title={
            audioBlocked && musicOn
              ? t("enableSound")
              : musicOn
                ? t("muteMusic")
                : t("unmuteMusic")
          }
        >
          {musicAudible ? "♪" : musicOn && audioBlocked ? "♪!" : "♪̸"}
        </button>
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-lg text-text transition-colors hover:border-brand/40"
          aria-label={t("previous")}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={togglePlayback}
          className="flex h-8 min-w-8 items-center justify-center rounded-full border border-border px-2 text-xs text-text transition-colors hover:border-brand/40"
          aria-label={playing ? t("pause") : t("play")}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-lg text-text transition-colors hover:border-brand/40"
          aria-label={t("next")}
        >
          ›
        </button>
      </div>
    </div>
  );

  return (
    <>
      <audio ref={audioRef} src={STUDIO_PRESENTATION_AUDIO.src} loop preload="auto" />

      <div
        ref={containerRef}
        className="presentation-float relative z-20 mx-auto w-full max-w-5xl"
      >
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 px-1">
          <div>
            <div className="accent-line mb-3" />
            <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl lg:text-4xl">
              {t("title")}
            </h2>
          </div>
          {audioBlocked && musicOn && (
            <button
              type="button"
              onClick={() => void unlockAudio()}
              className="rounded-full border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent/20"
            >
              {t("enableSound")}
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/80 bg-[#0a0a0a] shadow-2xl shadow-black/50 ring-1 ring-white/5">
          <SlideStage index={index} playing={playing} reduceMotion={reduceMotion} />
          {controls}
        </div>

        <p className="mt-3 text-center text-[11px] text-text-muted/80">
          {t("musicCredit")} ·{" "}
          <Link href="/sobre" prefetch={false} className="text-brand-light underline-offset-2 hover:underline">
            {t("aboutLink")}
          </Link>
        </p>
      </div>

      {isExpanded && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={t("title")}
          onClick={closeExpanded}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeExpanded}
              className="absolute -top-2 right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-surface/95 text-lg text-text shadow-lg backdrop-blur-sm transition-colors hover:border-accent/40 hover:text-accent sm:-top-3"
              aria-label={t("close")}
            >
              ×
            </button>
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-[#0a0a0a] shadow-2xl shadow-black/60 ring-1 ring-accent/20">
              <SlideStage index={index} playing={playing} reduceMotion={reduceMotion} />
              {controls}
            </div>
          </div>
        </div>
      )}

      {isDocked && !isExpanded && (
        <div className="presentation-dock-in fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,20rem)]">
          <div className="mb-2 flex justify-end gap-1.5">
            <button
              type="button"
              onClick={openExpanded}
              className="rounded-full border border-border/80 bg-surface/90 px-3 py-1 text-[10px] text-text-muted backdrop-blur-md transition-colors hover:text-text"
            >
              {t("expand")}
            </button>
            <button
              type="button"
              onClick={dismissDocked}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-sm text-text-muted backdrop-blur-md transition-colors hover:border-accent/40 hover:text-text"
              aria-label={t("close")}
            >
              ×
            </button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/80 bg-[#0a0a0a] shadow-2xl shadow-black/60 ring-1 ring-accent/20">
            <SlideStage index={index} playing={playing} reduceMotion={reduceMotion} compact />
            <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-surface/95 px-2 py-1.5">
              <span className="truncate text-[10px] text-text-muted">
                {t(`slides.${slideId}.title`)}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={toggleMusic}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                    musicAudible
                      ? "border-accent/40 text-accent"
                      : musicOn && audioBlocked
                        ? "border-amber-500/40 text-amber-400"
                        : "border-border text-text-muted",
                  )}
                  aria-label={
                    audioBlocked && musicOn
                      ? t("enableSound")
                      : musicOn
                        ? t("muteMusic")
                        : t("unmuteMusic")
                  }
                >
                  {musicAudible ? "♪" : musicOn && audioBlocked ? "♪!" : "♪̸"}
                </button>
                <button
                  type="button"
                  onClick={togglePlayback}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-[10px] text-text"
                  aria-label={playing ? t("pause") : t("play")}
                >
                  {playing ? "❚" : "▶"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
