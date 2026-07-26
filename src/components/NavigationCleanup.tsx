"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function NavigationCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = "";
  }, [pathname]);

  return null;
}