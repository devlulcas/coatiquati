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
  NewContent,
  UpdateContent,
} from '@/modules/content/types/content';
import { db, type Database } from '@/modules/database/db';
import { contentTable } from '@/modules/database/schema/content';
import { contentContributionTable } from '@/modules/database/schema/contribution';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';

export type ContentRepository = {
  createBaseContent(db: Database, content: NewContent): Promise<number>;
  updateBaseContent(db: Database, content: UpdateContent): Promise<BaseContent>;
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
  async createBaseContent(idb: Database, content: NewContent): Promise<number> {
    const insertedContent = idb
      .insert(contentTable)
      .values({
        title: content.title,
        active: content.active,
        contentType: content.contentType,
        authorId: content.authorId,
        topicId: content.topicId,
      })
      .returning({ id: contentTable.id })
      .get();

    return insertedContent.id;
  }

  async updateBaseContent(db: Database, content: UpdateContent): Promise<BaseContent> {
    const updatedAt = new Date().toISOString();

    return db.transaction(async tx => {
      tx.update(contentTable)
        .set({
          title: content.title,
          active: content.active,
          topicId: content.topicId,
          updatedAt: updatedAt,
        })
        .execute();

      tx.update(contentContributionTable)
        .set({
          contentId: content.id,
          userId: content.contributorId,
          contributedAt: updatedAt,
        })
        .execute();

      return this.getBaseContent(content.id);
    });
  }

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
    const resultRichtext: ContentRichTextPreview | undefined = await db.query.contentRichTextTable.findFirst({
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
      content: { ...resultRichtext, previewAsJson: JSON.parse(String(resultRichtext.previewAsJson)) },
    };
  }
}
