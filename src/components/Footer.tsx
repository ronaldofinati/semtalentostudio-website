import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { siteConfig } from "@/config/site";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface-elevated">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo variant="footer" showText={false} />
            <p className="mt-4 max-w-xs text-sm text-text-muted">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-text">{t("menu")}</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <Link href="/projetos" prefetch={false} className="hover:text-text">
                  {tNav("projects")}
                </Link>
              </li>
              <li>
                <Link href="/ferramentas" prefetch={false} className="hover:text-text">
                  {tNav("tools")}
                </Link>
              </li>
              <li>
                <Link href="/educacao" prefetch={false} className="hover:text-text">
                  {tNav("education")}
                </Link>
              </li>
              <li>
                <Link href="/conteudo" prefetch={false} className="hover:text-text">
                  {tNav("content")}
                </Link>
              </li>
              <li>
                <Link href="/contato" prefetch={false} className="hover:text-text">
                  {tNav("contact")}
                </Link>
              </li>
              <li>
                <Link href="/sobre" prefetch={false} className="hover:text-text">
                  {tNav("about")}
                </Link>
              </li>
              <li>
                <Link href="/privacidade" prefetch={false} className="hover:text-text">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium text-text">{t("links")}</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a
                  href={siteConfig.youtube.channel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-text"
                >
                  YouTube {siteConfig.youtube.handle}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-text"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-muted">
          © {year} {siteConfig.name}. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
