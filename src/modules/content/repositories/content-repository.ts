import type {
  BaseContent,
  ContentRichTextPreview,
  ContentVideo,
  ContentWithImage,
  ContentWithRichTextPreview,
  ContentWithVideo
} from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { log } from '@/modules/logging/lib/pino';

export class ContentRepository {
  async getContentWithImage(content: BaseContent): Promise<ContentWithImage> {
    const resultImage = await db.query.contentImageTable.findFirst({
      where: (fields, operators) => operators.eq(fields.baseContentId, content.id),
    });

    if (!resultImage) {
      log.error('Erro ao buscar imagem', content.id);
      throw new Error('Erro ao buscar conteúdo de imagem');
    }

    return {
      ...content,
      contentType: 'image',
      content: resultImage,
    };
  }

  async getContentWithVideo(content: BaseContent): Promise<ContentWithVideo> {
    const resultVideo: ContentVideo | undefined = await db.query.contentVideoTable.findFirst({
      where: (fields, operators) => operators.eq(fields.baseContentId, content.id),
    });

    if (!resultVideo) {
      throw new Error('Erro ao buscar conteúdo de video com id = ' + content.id);
    }

    return {
      ...content,
      contentType: 'video',
      content: resultVideo,
    };
  }

  async getContentWithRichTextPreview(content: BaseContent): Promise<ContentWithRichTextPreview> {
    const resultRichtext: ContentRichTextPreview | undefined = await db.query.contentRichTextTable.findFirst({
      where: (fields, operators) => operators.eq(fields.baseContentId, content.id),
    })

    if (!resultRichtext) {
      throw new Error('Erro ao buscar conteúdo de rich text com id = ' + content.id);
    }

    return {
      ...content,
      contentType: 'rich_text',
      content: { ...resultRichtext, previewAsJson: JSON.parse(JSON.stringify(resultRichtext.previewAsJson)) },
    };
  }
}
