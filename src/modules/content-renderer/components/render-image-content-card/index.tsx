import type { ContentWithImage } from '@/modules/content/types/content';
import Image from 'next/image';
import { RenderedContentWrapper } from '../rendered-content-wrapper';
import { ZoomedImage } from './zoomed-image';

export async function RenderImageContentCard({ data }: { data: ContentWithImage }) {
  return (
    <RenderedContentWrapper
      title={data.title}
      by={data.author}
      content={{ id: data.content.baseContentId, type: data.contentType }}
    >
      <div className="absolute right-2 top-1 z-10">
        <ZoomedImage content={data} />
      </div>

      <Image
        title={data.title}
        className="max-h-[50vh] w-auto rounded object-contain"
        alt={data.content.description}
        src={data.content.src}
        width={1240}
        height={1080}
      />

      <p className="text-md text-muted-foreground">{data.content.description}</p>
    </RenderedContentWrapper>
  );
}
