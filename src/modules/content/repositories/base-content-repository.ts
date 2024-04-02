import type { BaseContent } from '@/modules/content/types/content';
import { ContributionRepository } from '@/modules/contributions/repositories/contribution-repository';
import { db, type DBTransaction } from '@/modules/database/db';
import { contentTable, type NewContentTable } from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';
import type { WithOptionalID } from '@/shared/utils/with';
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

  async upsertBaseContent(content: WithOptionalID<NewContentTable>, tx: DBTransaction): Promise<number> {
    try {
      const insertedContent = await tx
        .insert(contentTable)
        .values(content)
        .onConflictDoUpdate({ target: [contentTable.id], set: content })
        .returning({ id: contentTable.id })
        .get();

      await this.contributionRepository.save(content.authorId, { contentId: insertedContent.id }, tx);

      return insertedContent.id;
    } catch (error) {
      log.error('Erro ao salvar conteúdo', { content, error });
      throw new Error('Erro ao salvar conteúdo');
    }
  }

  async getBaseContent(id: number): Promise<BaseContent> {
    const result = await db.query.contentTable.findFirst({
      with: {
        author: true,
        contributors: {
          with: { user: true },
        },
      },
      where: (fields, operators) => operators.eq(fields.id, id),
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
    const result = await db
      .select({ authorId: contentTable.authorId })
      .from(contentTable)
      .where(eq(contentTable.id, contentId))
      .get();

    if (!result) {
      log.error('Erro ao buscar autor do conteúdo de vídeo', { contentId });
      throw new Error('Erro ao buscar autor do conteúdo de vídeo com id = ' + contentId);
    }

    return result.authorId;
  }
}
