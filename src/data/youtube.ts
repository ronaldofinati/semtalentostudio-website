export interface YouTubeVideo {
  id: string;
  slug: string;
  videoId: string;
}

/** Lista vazia — novos videos serao adicionados depois. */
export const youtubeVideos: YouTubeVideo[] = [];
