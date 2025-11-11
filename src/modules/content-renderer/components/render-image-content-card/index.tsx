import type { ImageContent } from '@/modules/content/types/content';
import { ContentType } from '@/modules/database/schema/content';
import Image from 'next/image';
import { ZoomedImage } from '../../../image-content/components/zoomed-image';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

export async function RenderImageContentCard({ data }: { data: ImageContent }) {
  return (
    <RenderedContentWrapper
      title={data.title}
      by={data.author}
      content={{ id: data.id, type: ContentType.Image }}
    >
      <div className="absolute right-2 top-1 z-10">
        <ZoomedImage content={data} />
      </div>

      <Image
        title={data.title}
        className="max-h-[50vh] w-auto rounded object-contain"
        alt={data.imageContent.alt}
        src={data.imageContent.src}
        width={1240}
        height={1080}
      />

      {data.description && (
        <p className="text-md text-muted-foreground">{data.description}</p>
      )}
    </RenderedContentWrapper>
  );
}
