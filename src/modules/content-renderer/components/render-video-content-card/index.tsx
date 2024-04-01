import { getCommentsOnContentQuery } from '@/modules/comments/actions/get-comments-on-content-query';
import type { ContentWithVideo } from '@/modules/content/types/content';
import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

function getYoutubeVideoIdFromUrl(url: string) {
  const urlObject = new URL(url);
  const searchParams = new URLSearchParams(urlObject.search);
  const videoId = searchParams.get('v');
  return videoId;
}

export async function RenderVideoContentCard({ data }: { data: ContentWithVideo }) {
  const videoId = getYoutubeVideoIdFromUrl(data.content.src);

  const comments = await getCommentsOnContentQuery(data.content.baseContentId);

  if (!videoId) {
    return null;
  }

  return (
    <RenderedContentWrapper
      title={data.title}
      by={data.author}
      content={{ id: data.content.baseContentId, type: data.contentType }}
      comments={comments}
    >
      <YouTubeEmbed id={videoId} title={data.title} />
      <p className="text-md text-muted-foreground">{data.content.description}</p>
    </RenderedContentWrapper>
  );
}
