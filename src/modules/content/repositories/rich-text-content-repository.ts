import type { ContentRichText, NewContent, UpdateContent } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { contentRichTextTable } from '@/modules/database/schema/content';
import { contentContributionTable } from '@/modules/database/schema/contribution';
import type { JSONContent } from '@tiptap/core';
import { diffJson } from 'diff';
import { eq } from 'drizzle-orm';
import { DrizzleContentRepository } from './content-repository';

export type RichTextContentRepository = {
  getContent(contentId: number): Promise<ContentRichText>;
  createContent(baseContent: NewContent, richText: JSONContent): Promise<ContentRichText>;
  updateContent(baseContent: UpdateContent, richText: JSONContent): Promise<ContentRichText>;
  omitContent(contentId: number): Promise<void>;
};

export const RTE_CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  contentId: true,
});

export class DrizzleRichTextContentRepository implements RichTextContentRepository {
  /**
   * Busca um conteúdo de texto complexo com base no seu id
   */
  async getContent(contentId: number): Promise<ContentRichText> {
    const resultRichtext: ContentRichText | undefined = await db.query.contentRichTextTable.findFirst({
      columns: {
        ...RTE_CONTENT_DB_FIELDS,
        asJson: true,
      },
      where(fields, operators) {
        return operators.eq(fields.contentId, contentId);
      },
    });

    if (!resultRichtext) {
      throw new Error('Erro ao buscar conteúdo de rich text com id = ' + contentId);
    }

    return resultRichtext;
  }

  /**
   * Cria um conteúdo de texto complexo
   */
  async createContent(baseContent: NewContent, richText: JSONContent): Promise<ContentRichText> {
    const repository = new DrizzleContentRepository();

    const contentId = await db.transaction(async tx => {
      try {
        const insertedContentId = await repository.createBaseContent(tx, baseContent);

        const preview = richText.content?.slice(0, 5) ?? {};

        console.table({
          contentId: insertedContentId,
          asJson: richText,
          previewAsJson: preview,
        });

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
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de rich text com id = ' + richText.contentId);
      }
    });

    return this.getContent(contentId);
  }

  /**
   * Atualiza um conteúdo de texto complexo
   */
  async updateContent(baseContent: UpdateContent, richText: JSONContent): Promise<ContentRichText> {
    const updatedAt = new Date().toISOString();
    const repository = new DrizzleContentRepository();

    if (typeof richText === 'undefined') {
      throw new Error('Erro ao atualizar conteúdo de rich text com id = ' + baseContent.id);
    }

    return db.transaction(async tx => {
      try {
        const preview = richText.content?.slice(0, 5) ?? {};

        const oldContent = await this.getContent(baseContent.id);

        await repository.updateBaseContent(tx, baseContent);

        await tx
          .update(contentRichTextTable)
          .set({
            asJson: richText,
            previewAsJson: preview,
            updatedAt: updatedAt,
          })
          .where(eq(contentRichTextTable.contentId, baseContent.id))
          .execute();

        const diff = diffJson(oldContent.asJson, richText);

        await tx
          .update(contentContributionTable)
          .set({
            userId: baseContent.contributorId,
            diff: diff,
            contentId: baseContent.id,
            contributedAt: updatedAt,
          })
          .where(eq(contentContributionTable.contentId, baseContent.id))
          .execute();

        const resultRichtext = await this.getContent(baseContent.id);

        return resultRichtext;
      } catch (error) {
        tx.rollback();
        throw new Error('Erro ao atualizar conteúdo de rich text com id = ' + baseContent.id);
      }
    });
  }

  /**
   * Remove um conteúdo de texto complexo
   */
  async omitContent(contentId: number): Promise<void> {
    await db.delete(contentRichTextTable).where(eq(contentRichTextTable.contentId, contentId)).execute();
    return;
  }
}
