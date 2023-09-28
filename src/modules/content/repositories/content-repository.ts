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
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';

export type ContentRepository = {
  getBaseContent(id: number): Promise<BaseContent>;
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
  async getBaseContent(id: number): Promise<BaseContent> {
    const result = await db.query.contentTable.findFirst({
      columns: CONTENT_DB_FIELDS,
      with: {
        author: {
          columns: CONTRIBUTOR_DB_FIELDS,
        },
        contributors: {
          with: {
            user: {
              columns: CONTRIBUTOR_DB_FIELDS,
            },
          },
        },
      },
      where: (fields, operators) => {
        return operators.eq(fields.id, id);
      },
    });

    if (!result) {
      throw new Error('Erro ao buscar conteúdo');
    }

    return result;
  }

  async getContentWithFile(content: BaseContent): Promise<ContentWithFile> {
    const resultFile: ContentFile | undefined = await db.query.contentFileTable.findFirst({
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

  async getContentWithImage(content: BaseContent): Promise<ContentWithImage> {
    const resultImage: ContentImage | undefined = await db.query.contentImageTable.findFirst({
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

  async getContentWithVideo(content: BaseContent): Promise<ContentWithVideo> {
    const resultVideo: ContentVideo | undefined = await db.query.contentVideoTable.findFirst({
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

  async getContentWithRichTextPreview(content: BaseContent): Promise<ContentWithRichTextPreview> {
    const resultRichtext: ContentRichTextPreview | undefined =
      await db.query.contentRichTextTable.findFirst({
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
      content: resultRichtext,
    };
  }
}
