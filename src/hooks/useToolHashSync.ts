"use client";

import { useCallback, useEffect, useState } from "react";
import { notifyToolHashChange, setLocationHash, TOOL_HASH_CHANGE } from "@/lib/tool-hash";

type Options<T extends string> = {
  hashToTool: (hash: string) => T | null;
  onSectionHash?: (hash: string) => void;
};

/**
 * Mantém a ferramenta ativa sincronizada com o hash da URL,
 * inclusive quando o menu troca de item sem disparar `hashchange`.
 */
export function useToolHashSync<T extends string>({
  hashToTool,
  onSectionHash,
}: Options<T>) {
  const [active, setActive] = useState<T | null>(null);

  const sync = useCallback(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    setActive(hashToTool(hash));
    onSectionHash?.(hash);
  }, [hashToTool, onSectionHash]);

  useEffect(() => {
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    window.addEventListener(TOOL_HASH_CHANGE, sync);

    const onDocClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;
      queueMicrotask(sync);
      window.setTimeout(sync, 0);
      window.setTimeout(sync, 80);
    };

    document.addEventListener("click", onDocClick, true);
    return () => {
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      window.removeEventListener(TOOL_HASH_CHANGE, sync);
      document.removeEventListener("click", onDocClick, true);
    };
  }, [sync]);

  const setTool = useCallback((tool: T | null) => {
    setActive(tool);
    if (!tool) {
      setLocationHash("");
    } else {
      setLocationHash(tool);
    }
  }, []);

  return { active, setTool, syncFromLocation: sync, notifyToolHashChange };
}
