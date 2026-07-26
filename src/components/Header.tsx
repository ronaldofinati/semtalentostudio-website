"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { notifyToolHashChange } from "@/lib/tool-hash";
import { Logo } from "./Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { cn } from "@/lib/utils";

type ToolsGroup = "software" | "utilities";

type NavChild = {
  href: string;
  labelKey?: string;
  projectSlug?: string;
  toolsKey?:
    | "sizeGuide"
    | "imagensColorir"
    | "quimicaLab"
    | "jogoDamas"
    | "jogoXadrez"
    | "simuladorEducacional"
    | "labcad"
    | "nestlab"
    | "3d-models"
    | "converter";
  viewAll?: boolean;
  group?: ToolsGroup;
};

type NavItem = {
  href: string;
  key: "home" | "projects" | "tools" | "education" | "content" | "about" | "contact";
  children?: NavChild[];
};

const TOOLS_GROUPS: ToolsGroup[] = ["software", "utilities"];

const navItems: NavItem[] = [
  { href: "/", key: "home" },
  {
    href: "/projetos",
    key: "projects",
    children: [
      { href: "/projetos", viewAll: true },
      { href: "/projetos/footwear-design", projectSlug: "footwear-design" },
      { href: "/projetos/product-design", projectSlug: "product-design" },
      { href: "/projetos/inflatable-design", projectSlug: "inflatable-design" },
      { href: "/projetos/web-design", projectSlug: "web-design" },
    ],
  },
  {
    href: "/ferramentas",
    key: "tools",
    children: [
      { href: "/ferramentas", viewAll: true },
      { href: "/ferramentas#size-guide", toolsKey: "sizeGuide", group: "software" },
      { href: "/projetos/labcad", toolsKey: "labcad", group: "software" },
      { href: "/projetos/nestlab", toolsKey: "nestlab", group: "software" },
      { href: "/projetos/3d-models", toolsKey: "3d-models", group: "utilities" },
      { href: "/ferramentas#converter", toolsKey: "converter", group: "utilities" },
    ],
  },
  {
    href: "/educacao",
    key: "education",
    children: [
      { href: "/educacao", viewAll: true },
      { href: "/educacao#imagens-colorir", toolsKey: "imagensColorir" },
      { href: "/educacao#simulador-educacional", toolsKey: "simuladorEducacional" },
      { href: "/educacao#quimica-lab", toolsKey: "quimicaLab" },
      { href: "/educacao#jogo-damas", toolsKey: "jogoDamas" },
      { href: "/educacao#jogo-xadrez", toolsKey: "jogoXadrez" },
    ],
  },
  { href: "/conteudo", key: "content" },
  { href: "/sobre", key: "about" },
  { href: "/contato", key: "contact" },
];

function useChildLabel() {
  const tNav = useTranslations("nav");
  const tProjects = useTranslations("projects.items");
  const tTools = useTranslations("tools");

  return (child: NavChild) => {
    if (child.viewAll) return tNav("viewAll");
    if (child.projectSlug) return tProjects(`${child.projectSlug}.title`);
    if (child.toolsKey === "sizeGuide") return tTools("sizeGuide.title");
    if (child.toolsKey === "imagensColorir") return tTools("imagensColorir.title");
    if (child.toolsKey === "quimicaLab") return tTools("quimicaLab.title");
    if (child.toolsKey === "jogoDamas") return tTools("jogoDamas.title");
    if (child.toolsKey === "jogoXadrez") return tTools("jogoXadrez.title");
    if (child.toolsKey === "simuladorEducacional")
      return tTools("simuladorEducacional.title");
    if (child.toolsKey === "labcad") return tProjects("labcad.title");
    if (child.toolsKey === "nestlab") return tProjects("nestlab.title");
    if (child.toolsKey === "3d-models") return tProjects("3d-models.title");
    if (child.toolsKey === "converter") return tTools("coming.converter.title");
    return child.labelKey ? tNav(child.labelKey) : "";
  };
}

function groupTitleKey(group: ToolsGroup) {
  if (group === "software") return "sections.software.title" as const;
  return "sections.utilities.title" as const;
}

function NavLinkItem({
  child,
  onNavigate,
  compact = false,
}: {
  child: NavChild;
  onNavigate: () => void;
  compact?: boolean;
}) {
  const labelOf = useChildLabel();

  return (
    <Link
      href={child.href}
      prefetch={false}
      role="menuitem"
      className={cn(
        "block transition-colors",
        compact ? "px-2.5 py-1.5 text-xs" : "px-2.5 py-2 text-sm",
        child.viewAll
          ? "font-medium text-brand-light hover:bg-surface-muted"
          : "text-text-muted hover:bg-surface-muted hover:text-text",
      )}
      onClick={() => {
        onNavigate();
        if (child.href.includes("#")) notifyToolHashChange();
      }}
    >
      {labelOf(child)}
    </Link>
  );
}

/** Lista simples (ex.: Projetos, Educacao). */
function NavChildrenList({
  items,
  onNavigate,
  compact = false,
}: {
  items: NavChild[];
  onNavigate: () => void;
  compact?: boolean;
}) {
  return (
    <>
      {items.map((child) => (
        <NavLinkItem
          key={`${child.href}-${child.projectSlug ?? child.toolsKey ?? "all"}`}
          child={child}
          onNavigate={onNavigate}
          compact={compact}
        />
      ))}
    </>
  );
}

/** Dropdown Ferramentas: Ver todos + 2 colunas lado a lado. */
function ToolsMegaMenu({
  items,
  onNavigate,
  compact = false,
}: {
  items: NavChild[];
  onNavigate: () => void;
  compact?: boolean;
}) {
  const tTools = useTranslations("tools");
  const viewAll = items.find((c) => c.viewAll);
  const byGroup = TOOLS_GROUPS.map((group) => ({
    group,
    items: items.filter((c) => c.group === group),
  }));

  return (
    <div className={cn(compact ? "p-2" : "p-3")}>
      {viewAll && (
        <div className="mb-2 border-b border-border/60 pb-2">
          <NavLinkItem child={viewAll} onNavigate={onNavigate} compact={compact} />
        </div>
      )}
      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-1 min-[380px]:grid-cols-2" : "grid-cols-2",
        )}
      >
        {byGroup.map(({ group, items: groupItems }) => (
          <div
            key={group}
            className={cn(
              "min-w-0",
              !compact && "border-l border-border/50 pl-3 first:border-l-0 first:pl-0",
            )}
          >
            <p
              className={cn(
                "mb-1 px-2.5 font-medium tracking-wide text-text-muted/70 uppercase",
                compact ? "text-[0.6rem]" : "text-[0.65rem]",
              )}
            >
              {tTools(groupTitleKey(group))}
            </p>
            <div className="flex flex-col">
              {groupItems.length > 0 ? (
                groupItems.map((child) => (
                  <NavLinkItem
                    key={`${child.href}-${child.toolsKey}`}
                    child={child}
                    onNavigate={onNavigate}
                    compact={compact}
                  />
                ))
              ) : (
                <p
                  className={cn(
                    "px-2.5 py-1.5 text-text-muted/50",
                    compact ? "text-[0.65rem]" : "text-xs",
                  )}
                >
                  —
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopDropdown({ item }: { item: NavItem }) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuId = useId();
  const isTools = item.key === "tools";

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => () => clearClose(), []);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        prefetch={false}
        className={cn(
          "rounded-full px-3 py-2 text-sm text-text-muted transition-colors",
          "hover:bg-surface-elevated hover:text-text",
        )}
      >
        {t(item.key)}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-text-muted transition-colors",
          "hover:bg-surface-elevated hover:text-text",
          open && "bg-surface-elevated text-text",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {t(item.key)}
        <span className={cn("text-[0.65rem] transition-transform", open && "rotate-180")} aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className={cn(
            "absolute top-full z-50 mt-1 rounded-xl border border-border bg-surface-elevated shadow-lg shadow-black/40",
            isTools
              ? "left-1/2 w-[min(92vw,22rem)] -translate-x-1/2 sm:left-0 sm:translate-x-0"
              : "left-0 min-w-[13.5rem] py-1.5",
          )}
          onMouseEnter={clearClose}
          onMouseLeave={scheduleClose}
        >
          {isTools ? (
            <ToolsMegaMenu
              items={item.children}
              onNavigate={() => setOpen(false)}
            />
          ) : (
            <NavChildrenList
              items={item.children}
              onNavigate={() => setOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function MobileNav() {
  const t = useTranslations("nav");
  const [openKey, setOpenKey] = useState<NavItem["key"] | null>(null);
  const openItem = navItems.find((item) => item.key === openKey);
  const isTools = openItem?.key === "tools";

  return (
    <nav className="border-t border-border/40 md:hidden" aria-label="Principal mobile">
      {/* Overflow só na fileira de pills — o submenu fica fora e não é cortado. */}
      <div className="flex max-w-full gap-1 overflow-x-auto overscroll-x-contain px-4 py-2">
        {navItems.map((item) => {
          if (!item.children?.length) {
            return (
              <Link
                key={item.key}
                href={item.href}
                prefetch={false}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs text-text-muted transition-colors hover:bg-surface-elevated hover:text-text"
                onClick={() => setOpenKey(null)}
              >
                {t(item.key)}
              </Link>
            );
          }

          const open = openKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs text-text-muted transition-colors",
                "hover:bg-surface-elevated hover:text-text",
                open && "bg-surface-elevated text-text",
              )}
              aria-expanded={open}
              aria-controls={`mobile-submenu-${item.key}`}
              onClick={() => setOpenKey((k) => (k === item.key ? null : item.key))}
            >
              {t(item.key)}
              <span
                className={cn("text-[0.6rem] transition-transform", open && "rotate-180")}
                aria-hidden
              >
                ▾
              </span>
            </button>
          );
        })}
      </div>

      {openItem?.children?.length ? (
        <div
          id={`mobile-submenu-${openItem.key}`}
          role="menu"
          className="border-t border-border/40 bg-surface-elevated px-2 py-2"
        >
          {isTools ? (
            <ToolsMegaMenu
              items={openItem.children}
              onNavigate={() => setOpenKey(null)}
              compact
            />
          ) : (
            <NavChildrenList
              items={openItem.children}
              onNavigate={() => setOpenKey(null)}
              compact
            />
          )}
        </div>
      ) : null}
    </nav>
  );
}

export function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/85 shadow-[0_1px_0_0_rgba(200,169,110,0.08)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" prefetch={false} className="flex h-full items-center transition-opacity hover:opacity-80">
          <Logo variant="header" showText={false} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {navItems.map((item) => (
            <DesktopDropdown key={item.key} item={item} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher className="hidden sm:flex" />
          <Link
            href="/contato"
            prefetch={false}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-surface transition-colors hover:bg-accent/90 md:hidden"
          >
            {t("contact")}
          </Link>
        </div>
      </div>

      <MobileNav />
    </header>
  );
}
