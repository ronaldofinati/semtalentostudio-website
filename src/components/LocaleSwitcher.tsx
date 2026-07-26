"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common.locale");

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            locale === loc
              ? "bg-brand/20 text-brand-light"
              : "text-text-muted hover:text-text",
          )}
          aria-label={t(loc)}
          aria-current={locale === loc ? "true" : undefined}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
