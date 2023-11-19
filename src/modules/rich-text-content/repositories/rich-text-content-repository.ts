import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentRichText, NewContent, UpdateContent } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { contentRichTextTable } from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';
import type { JSONContent } from '@tiptap/core';
import { eq } from 'drizzle-orm';

export const RTE_CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  contentId: true,
});

export class RichTextContentRepository {
  constructor(private readonly baseContentRepository: BaseContentRepository = new BaseContentRepository()) {}

  /**
   * Busca um conteúdo de texto complexo com base no seu id
   */
  async getContent(contentId: number, database = db): Promise<ContentRichText> {
    const resultRichtext: ContentRichText | undefined = await database.query.contentRichTextTable.findFirst({
      columns: {
        ...RTE_CONTENT_DB_FIELDS,
        asJson: true,
      },
      where(fields, operators) {
        return operators.eq(fields.contentId, contentId);
      },
    });

    if (!resultRichtext) {
      log.error('Erro ao buscar conteúdo de rich text', { contentId });
      throw new Error('Erro ao buscar conteúdo de rich text com id = ' + contentId);
    }

    return resultRichtext;
  }

  /**
   * Cria um conteúdo de texto complexo
   */
  async createContent(baseContent: NewContent, richText: JSONContent, database = db): Promise<ContentRichText> {
    const contentId = await database.transaction(async tx => {
      try {
        const insertedContentId = await this.baseContentRepository.createBaseContent(baseContent, tx);

        // Troca o conteúdo por um preview, limitando a 3 itens
        const preview: JSONContent = {
          ...richText,
          content: richText.content?.slice(0, 3) ?? [],
        };

        await tx
          .insert(contentRichTextTable)
          .values({
            contentId: insertedContentId,
            asJson: richText,
            previewAsJson: preview,
          })
          .execute();

        return insertedContentId;
      } catch (error) {
        log.error('Erro ao criar conteúdo de rich text.', { baseContent, richText, error });
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de rich text com id = ' + richText.contentId);
      }
    });

    return this.getContent(contentId);
  }

  /**
   * Atualiza um conteúdo de texto complexo
   */
  async updateContent(baseContent: UpdateContent, richText?: JSONContent, database = db): Promise<ContentRichText> {
    const updatedAt = new Date().toISOString();

    if (typeof richText === 'undefined') {
      throw new Error('Erro ao atualizar conteúdo de rich text com id = ' + baseContent.id);
    }

    return database.transaction(async tx => {
      try {
        const preview: JSONContent = {
          ...richText,
          content: richText.content?.slice(0, 3) ?? [],
        };

        await this.baseContentRepository.updateBaseContent(baseContent, tx);

        await tx
          .update(contentRichTextTable)
          .set({
            asJson: richText,
            previewAsJson: preview,
            updatedAt: updatedAt,
          })
          .where(eq(contentRichTextTable.contentId, baseContent.id))
          .execute();

        const resultRichtext = await this.getContent(baseContent.id, tx);

        return resultRichtext;
      } catch (error) {
        log.error('Erro ao atualizar conteúdo de rich text.', { baseContent, richText, error });
        tx.rollback();
        throw new Error('Erro ao atualizar conteúdo de rich text com id = ' + baseContent.id);
      }
    });
  }
}
