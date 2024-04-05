import type { ContentWithVideo } from '@/modules/content/types/content';
import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

export const YOUTUBE_REGEX =
  /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be|youtube-nocookie\.com)\/(?!channel\/)(?!@)(.+)?$/;
export const YOUTUBE_REGEX_GLOBAL =
  /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)\/(?!channel\/)(?!@)(.+)?$/g;

export const isValidYoutubeUrl = (url: string) => {
  return url.match(YOUTUBE_REGEX);
};

const getEmbedIDFromYoutubeUrl = (url: string) => {
  if (!isValidYoutubeUrl(url)) {
    return null;
  }

  if (url.includes('/embed/')) {
    return url.split('/embed/').pop() || null;
  }

  if (url.includes('youtu.be')) {
    return url.split('/').pop() || null;
  }

  const videoIdRegex = /(?:v=|shorts\/)([-\w]+)/gm;
  const matches = videoIdRegex.exec(url);

  if (!matches || !matches[1]) {
    return null;
  }

  return matches[1];
};

export async function RenderVideoContentCard({ data }: { data: ContentWithVideo }) {
  const videoId = getEmbedIDFromYoutubeUrl(data.content.src);

  if (!videoId) {
    return 'Vídeo inválido';
  }

  return (
    <RenderedContentWrapper
      title={data.title}
      by={data.author}
      content={{ id: data.content.baseContentId, type: data.contentType }}
    >
      <YouTubeEmbed id={videoId} title={data.title} />
      <p className="text-md text-muted-foreground">{data.content.description}</p>
    </RenderedContentWrapper>
  );
}
