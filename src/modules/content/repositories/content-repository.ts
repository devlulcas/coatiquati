import type {
  BaseContent,
  ContentFile,
  ContentImage,
  ContentRichTextPreview,
  ContentVideo,
  ContentWithFile,
  ContentWithImage,
  ContentWithRichTextPreview,
  ContentWithVideo,
} from '@/modules/content/types/content';
import { db } from '@/modules/database/db';

export type ContentRepository = {
  getContentWithFile(content: BaseContent): Promise<ContentWithFile>;
  getContentWithImage(content: BaseContent): Promise<ContentWithImage>;
  getContentWithVideo(content: BaseContent): Promise<ContentWithVideo>;
  getContentWithRichTextPreview(content: BaseContent): Promise<ContentWithRichTextPreview>;
};

export const CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  active: true,
  contentType: true,
});

export class DrizzleContentRepository implements ContentRepository {
  async getContentWithFile(content: BaseContent, database = db): Promise<ContentWithFile> {
    const resultFile: ContentFile | undefined = await database.query.contentFileTable.findFirst({
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
    });

    if (!resultFile) {
      throw new Error('Erro ao buscar conteúdo');
    }

    return {
      ...content,
      contentType: 'file',
      content: resultFile,
    };
  }

  async getContentWithImage(content: BaseContent, database = db): Promise<ContentWithImage> {
    const resultImage: ContentImage | undefined = await database.query.contentImageTable.findFirst({
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true,
        contentId: true,
        alt: true,
        description: true,
        src: true,
      },
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
    });

    if (!resultImage) {
      throw new Error('Erro ao buscar conteúdo de imagem com id = ' + content.id);
    }

    return {
      ...content,
      contentType: 'image',
      content: resultImage,
    };
  }

  async getContentWithVideo(content: BaseContent, database = db): Promise<ContentWithVideo> {
    const resultVideo: ContentVideo | undefined = await database.query.contentVideoTable.findFirst({
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true,
        contentId: true,
        alt: true,
        description: true,
        src: true,
      },
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
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

  async getContentWithRichTextPreview(content: BaseContent, database = db): Promise<ContentWithRichTextPreview> {
    const resultRichtext: ContentRichTextPreview | undefined = await database.query.contentRichTextTable.findFirst({
      columns: {
        id: true,
        createdAt: true,
        updatedAt: true,
        contentId: true,
        previewAsJson: true,
      },
      where(fields, operators) {
        return operators.eq(fields.contentId, content.id);
      },
    });

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
