import type { ContentWithVideo } from '@/modules/content/types/content';
import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

function getYoutubeVideoIdFromUrl(url: string) {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);
  const videoId = searchParams.get('v');
  return videoId;
}

export function RenderVideoContentCard({ content }: { content: ContentWithVideo }) {
  const { content: data, ...meta } = content;

  const videoId = getYoutubeVideoIdFromUrl(data.src);

  if (!videoId) {
    return null;
  }

  return (
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <YouTubeEmbed id={videoId} title={meta.title} />
      <p className="text-md text-muted-foreground">{data.description}</p>
    </RenderedContentWrapper>
  );
}
