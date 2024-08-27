import type { Content } from '@/modules/content/types/content';
import { RenderImageContentCard } from '../render-image-content-card';
import { RenderRichTextContentCard } from '../render-rich-text-content-card';
import { RenderVideoContentCard } from '../render-video-content-card';

export function RenderCorrectContentCard({ data }: { data: Content }) {
  switch (data.contentType) {
    case 'image':
      return <RenderImageContentCard data={data} />;
    case 'video':
      return <RenderVideoContentCard data={data} />;
    case 'richText':
      return <RenderRichTextContentCard data={data} />;
    default:
      throw new Error('Tipo de conteúdo inválido');
  }
}
