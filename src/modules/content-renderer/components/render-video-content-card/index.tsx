import type { VideoContent } from '@/modules/content/types/content';
import { ContentType } from '@/modules/database/lib/content-enum';
import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { getEmbedIDFromYouTubeUrl } from '../../../video-content/lib/youtube';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

export async function RenderVideoContentCard({ data }: { data: VideoContent }) {
  const videoId = getEmbedIDFromYouTubeUrl(data.videoContent.src);

  if (!videoId) {
    return 'Vídeo inválido';
  }

  return (
    <RenderedContentWrapper title={data.title} by={data.author} content={{ id: data.id, type: ContentType.VIDEO }}>
      <YouTubeEmbed id={videoId} title={data.title} />

      {data.description && <p className="text-md text-muted-foreground">{data.description}</p>}
    </RenderedContentWrapper>
  );
}
