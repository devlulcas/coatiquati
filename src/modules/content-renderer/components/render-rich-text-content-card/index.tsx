import type { ContentWithRichTextPreview } from '@/modules/content/types/content';
import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { RenderedContentWrapper } from '../rendered-content-wrapper';

export async function RenderRichTextContentCard({ data }: { data: ContentWithRichTextPreview }) {
  return (
    <RenderedContentWrapper
      title={data.title}
      by={data.author}
      content={{ id: data.content.baseContentId, type: data.contentType }}
    >
      <ReadonlyEditor content={data.content.previewAsJson} />
      <Link href={`/contents/${data.id}`} className="text-md ml-1 flex items-center gap-2 text-muted-foreground">
        Ler mais <ArrowRightIcon size={16} />
      </Link>
    </RenderedContentWrapper>
  );
}
