import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { youtubeVideos } from "@/data/youtube";
import { siteConfig } from "@/config/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ContentPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContentPageInner />;
}

function ContentPageInner() {
  const t = useTranslations("content");
  const tCommon = useTranslations("common");
  const hasVideos = youtubeVideos.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader title={t("title")} />

      <p className="mb-10 text-text-muted">{t("channel")}</p>

      {hasVideos ? (
        <div className="grid gap-10">
          {youtubeVideos.map((video) => (
            <div key={video.id} className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <YouTubeEmbed
                videoId={video.videoId}
                title={t(`videos.${video.slug}.title`)}
              />
              <div>
                <h2 className="font-display text-xl font-semibold text-text">
                  {t(`videos.${video.slug}.title`)}
                </h2>
                <p className="mt-3 text-text-muted">
                  {t(`videos.${video.slug}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface-elevated px-6 py-16 text-center">
          <p className="text-lg text-text-muted">{t("empty")}</p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Button href={siteConfig.youtube.channel} external size="lg">
          {tCommon("subscribe")} — {siteConfig.youtube.handle}
        </Button>
      </div>
    </div>
  );
}
