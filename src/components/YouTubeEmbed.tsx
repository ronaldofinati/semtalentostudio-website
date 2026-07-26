import { siteConfig } from "@/config/site";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  const isPlaceholder = videoId.startsWith("PLACEHOLDER");

  if (isPlaceholder) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-border bg-surface-muted p-8 text-center">
        <p className="text-sm text-text-muted">{title}</p>
        <a
          href={siteConfig.youtube.channel}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-sm font-medium text-accent hover:underline"
        >
          {siteConfig.youtube.handle}
        </a>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}
