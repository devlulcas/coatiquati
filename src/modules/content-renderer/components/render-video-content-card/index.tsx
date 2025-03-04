import type { VideoContent } from '@/modules/content/types/content';
import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { getEmbedIDFromYoutubeUrl } from '../../../video-content/lib/youtube';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

export async function RenderVideoContentCard({ data }: { data: VideoContent }) {
  const videoId = getEmbedIDFromYoutubeUrl(data.content.src);

  if (!videoId) {
    return 'Vídeo inválido';
  }

  return (
    <RenderedContentWrapper title={data.title} by={data.author} content={{ id: data.id, type: data.contentType }}>
      <YouTubeEmbed id={videoId} title={data.title} />
      <p className="text-md text-muted-foreground">{data.content.description}</p>
    </RenderedContentWrapper>
  );
}
