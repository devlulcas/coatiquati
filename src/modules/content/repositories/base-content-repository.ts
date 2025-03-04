import type { BaseContent } from '@/modules/content/types/content';
import { ContributionRepository } from '@/modules/contributions/repositories/contribution-repository';
import { db } from '@/modules/database/db';
import { contentTable, type ContentInsert } from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import type { WithOptionalID } from '@/shared/utils/with';
import { eq } from 'drizzle-orm';

export class BaseContentRepository {
  constructor(private readonly contributionRepository = new ContributionRepository()) {}

  async upsertBaseContent(content: WithOptionalID<ContentInsert>): Promise<number> {
    try {
      const res = await db.transaction(async tx => {
        const insertedContent = await tx
          .insert(contentTable)
          .values(content)
          .onConflictDoUpdate({ target: [contentTable.id], set: content })
          .returning({ id: contentTable.id })
          .get();

        log.info('Conteúdo salvo com sucesso', { content: insertedContent });

        await this.contributionRepository.save(content.authorId, { contentId: insertedContent.id }, tx);

        log.info('Contribuição salva com sucesso', { content: insertedContent });

        return insertedContent.id;
      });

      return res;
    } catch (error) {
      log.error(error);
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
      log.error('Erro ao habilitar conteúdo.', { id, error });
      throw new Error('Erro ao habilitar conteúdo.');
    }
  }

  async omitBaseContent(id: number): Promise<void> {
    try {
      await db.update(contentTable).set({ active: false }).where(eq(contentTable.id, id)).execute();
    } catch (error) {
      log.error('Erro ao desabilitar conteúdo.', { id, error });
      throw new Error('Erro ao desabilitar conteúdo.');
    }
  }

  async getAuthorId(contentId: number): Promise<Result<string>> {
    const result = await wrapAsyncInResult(
      db.select({ authorId: contentTable.authorId }).from(contentTable).where(eq(contentTable.id, contentId)).get(),
    );

    if (isFail(result) || !result.value) {
      log.error('Erro ao buscar autor do conteúdo', { contentId });
      return fail('Erro ao buscar autor do conteúdo com id = ' + contentId);
    }

    return ok(result.value.authorId);
  }
}
