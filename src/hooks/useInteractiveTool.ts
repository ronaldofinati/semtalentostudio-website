"use client";

import { useCallback, useEffect, useState } from "react";
import { setLocationHash } from "@/lib/tool-hash";

type Options = {
  hashId: string;
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Estado de card → intro didática → painel da ferramenta. */
export function useInteractiveTool({ hashId, forceOpen, onOpenChange }: Options) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const open = forceOpen ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (onOpenChange) onOpenChange(next);
      else setInternalOpen(next);
    },
    [onOpenChange],
  );

  const requestOpen = useCallback(() => {
    setIntroOpen(true);
  }, []);

  const dismissIntro = useCallback(() => {
    setIntroOpen(false);
  }, []);

  const confirmOpen = useCallback(() => {
    setIntroOpen(false);
    setOpen(true);
    if (!onOpenChange && typeof window !== "undefined") {
      setLocationHash(hashId);
    }
  }, [hashId, onOpenChange, setOpen]);

  const closePanel = useCallback(() => {
    setOpen(false);
    if (!onOpenChange && typeof window !== "undefined") {
      setLocationHash("");
    }
  }, [onOpenChange, setOpen]);

  useEffect(() => {
    if (forceOpen !== undefined || onOpenChange) return;
    const syncFromHash = () => {
      if (window.location.hash === `#${hashId}`) setInternalOpen(true);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [forceOpen, onOpenChange, hashId]);

  return {
    open,
    introOpen,
    requestOpen,
    dismissIntro,
    confirmOpen,
    closePanel,
  };
}
