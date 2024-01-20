import type { ContentWithRichTextPreview } from '@/modules/content/types/content';
import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

export function RenderRichTextContentCard({ content }: { content: ContentWithRichTextPreview }) {
  const { content: data, ...meta } = content;

  return (
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <ReadonlyEditor content={data.previewAsJson} />
      <Link href={`/contents/${meta.id}`} className="text-md text-muted-foreground flex items-center gap-2">
        Ler mais <ArrowRightIcon size={16} />
      </Link>
    </RenderedContentWrapper>
  );
}
