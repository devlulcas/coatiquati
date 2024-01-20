import type { Content } from '@/modules/content/types/content';
import { RenderFileContentCard } from '../render-file-content-card';
import { RenderImageContentCard } from '../render-image-content-card';
import { RenderRichTextContentCard } from '../render-rich-text-content-card';
import { RenderVideoContentCard } from '../render-video-content-card';

export function RenderCorrectContentCard({ content }: { content: Content }) {
  switch (content.contentType) {
    case 'file':
      return <RenderFileContentCard content={content} />;
    case 'image':
      return <RenderImageContentCard content={content} />;
    case 'video':
      return <RenderVideoContentCard content={content} />;
    case 'rich_text':
      return <RenderRichTextContentCard content={content} />;
    default:
      throw new Error('Tipo de conteúdo inválido');
  }
}
