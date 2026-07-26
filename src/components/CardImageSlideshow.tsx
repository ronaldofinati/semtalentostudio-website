"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PROJECT_CARD_SLIDESHOW_INTERVAL_MS } from "@/data/project-media";

type CardImageSlideshowProps = {
  images: readonly string[];
  alt: string;
  className?: string;
  intervalMs?: number;
};

export function CardImageSlideshow({
  images,
  alt,
  className,
  intervalMs = PROJECT_CARD_SLIDESHOW_INTERVAL_MS,
}: CardImageSlideshowProps) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduceMotion || images.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [images.length, intervalMs, reduceMotion]);

  if (images.length === 0) return null;

  if (images.length === 1 || reduceMotion) {
    const src = images[0];
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-transform duration-300 group-hover:scale-105",
          className,
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized={/\.svg($|\?)/i.test(src)}
      />
    );
  }

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          fill
          className={cn(
            "object-cover transition-opacity duration-700 group-hover:scale-105",
            i === index ? "opacity-100" : "opacity-0",
            className,
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={i === 0}
          unoptimized={/\.svg($|\?)/i.test(src)}
        />
      ))}
    </>
  );
}