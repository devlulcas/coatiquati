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
import { contentStatus } from '@/shared/constants/content-status';
import { eq } from 'drizzle-orm';

export type BaseContentRepository = {
  createBaseContent(content: NewContent): Promise<number>;
  updateBaseContent(content: UpdateContent): Promise<BaseContent>;
  getBaseContent(id: number): Promise<BaseContent>;
  omitBaseContent(id: number): Promise<void>;
  enableBaseContent: (id: number) => Promise<void>;
};

export const CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  title: true,
  active: true,
  contentType: true,
});

export class DrizzleBaseContentRepository implements BaseContentRepository {
  async createBaseContent(content: NewContent, database = db): Promise<number> {
    const insertedContent = database
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

  async updateBaseContent(content: UpdateContent, database = db): Promise<BaseContent> {
    const updatedAt = new Date().toISOString();

    return database.transaction(async tx => {
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

      return this.getBaseContent(content.id, tx);
    });
  }

  async getBaseContent(id: number, database = db): Promise<BaseContent> {
    const result = await database.query.contentTable.findFirst({
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

  async enableBaseContent(id: number, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();
    try {
      await database.update(contentTable).set({ active: true, updatedAt }).where(eq(contentTable.id, id)).execute();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao habilitar trilha');
    }
  }

  async omitBaseContent(id: number, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();
    try {
      await database.update(contentTable).set({ active: false, updatedAt }).where(eq(contentTable.id, id)).execute();
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao omitir trilha');
    }
  }
}
