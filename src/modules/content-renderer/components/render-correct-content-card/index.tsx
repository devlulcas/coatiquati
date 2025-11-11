import { isRequired, type BaseContent } from '@/modules/content/types/content';
import { RenderImageContentCard } from '../render-image-content-card';
import { RenderRichTextContentCard } from '../render-rich-text-content-card';
import { RenderVideoContentCard } from '../render-video-content-card';

export function RenderCorrectContentCard({ data }: { data: BaseContent }) {
  if (isRequired(data, 'imageContent')) {
    return <RenderImageContentCard data={data} />;
  }

  if (isRequired(data, 'richTextContent')) {
    return <RenderRichTextContentCard data={data} />;
  }

  if (isRequired(data, 'videoContent')) {
    return <RenderVideoContentCard data={data} />;
  }

  return <div>Conteúdo inválido</div>;
}
