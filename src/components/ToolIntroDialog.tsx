"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

type ToolIntroDialogProps = {
  open: boolean;
  title: string;
  body: string;
  continueLabel: string;
  closeLabel: string;
  onClose: () => void;
  onContinue: () => void;
  className?: string;
};

export function ToolIntroDialog({
  open,
  title,
  body,
  continueLabel,
  closeLabel,
  onClose,
  onContinue,
  className,
}: ToolIntroDialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border",
          "bg-surface-elevated shadow-2xl shadow-black/50 outline-none",
          "animate-in fade-in zoom-in-95 duration-200",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border/70 px-4 py-3 sm:px-5">
          <h2
            id={titleId}
            className="font-display pr-2 text-lg font-semibold leading-snug text-text sm:text-xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs text-text-muted transition-colors hover:border-brand/40 hover:text-text"
          >
            {closeLabel}
          </button>
        </div>
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-sm leading-relaxed text-text-muted sm:text-[0.95rem]">
            {body}
          </p>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onContinue}
              className="rounded-full bg-gradient-to-r from-accent to-accent-soft px-5 py-2.5 text-sm font-medium text-surface shadow-lg shadow-accent/20 transition-all hover:brightness-105"
            >
              {continueLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
