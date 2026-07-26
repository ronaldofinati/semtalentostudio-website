import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFoundPage() {
  const t = useTranslations("common");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-6xl font-bold text-brand">404</h1>
      <p className="mt-4 text-text-muted">{t("notFound")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-surface hover:bg-accent/90"
      >
        {t("viewProjects")}
      </Link>
    </div>
  );
}
