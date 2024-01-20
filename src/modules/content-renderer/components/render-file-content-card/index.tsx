import type { ContentWithFile } from '@/modules/content/types/content';
import Link from 'next/link';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

export function RenderFileContentCard({ content }: { content: ContentWithFile }) {
  const { content: data, ...meta } = content;

  return (
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <Link href={data.url} className="text-md text-muted-foreground">
        {data.filename} - <span className="p-1 border rounded">{data.filesize}</span>
      </Link>
      <p className="text-md text-muted-foreground">{data.visualDescription}</p>
    </RenderedContentWrapper>
  );
}
