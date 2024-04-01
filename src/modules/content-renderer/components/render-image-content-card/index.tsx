'use client';

import type { ContentWithImage } from '@/modules/content/types/content';
import Image from 'next/image';
import { RenderedContentWrapper } from '../rendered-content-wrapper';
import { ZoomedImage } from './zoomed-image';

export function RenderImageContentCard({ content }: { content: ContentWithImage }) {
  const { content: data, ...meta } = content;

  return (
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <div className="absolute right-2 top-1 z-10">
        <ZoomedImage content={content} />
      </div>

      <Image
        title={meta.title}
        className="max-h-[50vh] w-auto rounded object-contain"
        alt={data.alt}
        src={data.src}
        width={1240}
        height={1080}
      />

      <p className="text-md text-muted-foreground">{data.description}</p>
    </RenderedContentWrapper>
  );
}
