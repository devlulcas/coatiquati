import type { BaseContent, NewContent, UpdateContent } from '@/modules/content/types/content';
import { ContributionRepository } from '@/modules/contributions/repositories/contribution-repository';
import { db } from '@/modules/database/db';
import { contentTable } from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { eq } from 'drizzle-orm';

export const CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  title: true,
  active: true,
  contentType: true,
});

export class BaseContentRepository {
  constructor(private readonly contributionRepository = new ContributionRepository()) {}

  async createBaseContent(content: NewContent): Promise<number> {
    const insertedContent = await db
      .insert(contentTable)
      .values({
        title: content.title,
        active: content.active,
        authorId: content.authorId,
        topicId: content.topicId,
      })
      .returning({ id: contentTable.id })
      .get();

    this.contributionRepository.contributeInContent(insertedContent.id, content.authorId, db);

    return insertedContent.id;
  }

  async updateBaseContent(content: UpdateContent): Promise<BaseContent> {
    const authorId = await this.getAuthorId(content.id);

    if (authorId !== content.contributorId) {
      throw new Error('Você não tem permissão para editar este conteúdo');
    }

    return db.transaction(async tx => {
      tx.update(contentTable)
        .set({
          title: content.title,
          active: content.active,
          topicId: content.topicId,
        })
        .execute();

      await this.contributionRepository.contributeInContent(content.id, content.contributorId, tx);

      return this.getBaseContent(content.id, tx);
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
      log.error('Erro ao buscar conteúdo', { id });
      throw new Error('Erro ao buscar conteúdo');
    }

    return result;
  }

  async enableBaseContent(id: number): Promise<void> {
    try {
      await db.update(contentTable).set({ active: true }).where(eq(contentTable.id, id)).execute();
    } catch (error) {
      log.error('Erro ao habilitar trilha.', { id, error });
      throw new Error('Erro ao habilitar trilha.');
    }
  }

  async omitBaseContent(id: number): Promise<void> {
    try {
      await db.update(contentTable).set({ active: false }).where(eq(contentTable.id, id)).execute();
    } catch (error) {
      log.error('Erro ao desabilitar trilha.', { id, error });
      throw new Error('Erro ao desabilitar trilha.');
    }
  }

  async getAuthorId(contentId: number): Promise<string> {
    const result = await db.select({authorId: contentTable.authorId}).from(contentTable).where(eq(contentTable.id, contentId)).get();

    if (!result) {
      log.error('Erro ao buscar autor do conteúdo de vídeo', { contentId });
      throw new Error('Erro ao buscar autor do conteúdo de vídeo com id = ' + contentId);
    }

    return result.authorId;
  }
}
