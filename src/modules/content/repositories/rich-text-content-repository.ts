import type { ContentRichText, UpdateContentRichText } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { contentRichTextTable } from '@/modules/database/schema/content';
import { contentContributionTable } from '@/modules/database/schema/contribution';
import { log } from '@/modules/logging/lib/pino';
import type { Contributor } from '@/modules/user/types/user';
import { diffJson } from 'diff';
import { eq } from 'drizzle-orm';

export type RichTextContentRepository = {
  getContent(contentId: number): Promise<ContentRichText>;
  createContent(content: ContentRichText): Promise<ContentRichText>;
  updateContent(content: UpdateContentRichText, by: Contributor['id']): Promise<ContentRichText>;
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
      log.error('Erro ao buscar conteúdo de rich text com id = ' + contentId);
      throw new Error('Erro ao buscar conteúdo de rich text com id = ' + contentId);
    }

    return resultRichtext;
  }

  /**
   * Cria um conteúdo de texto complexo
   */
  async createContent(content: ContentRichText): Promise<ContentRichText> {
    await db
      .insert(contentRichTextTable)
      .values({
        contentId: content.contentId,
        asJson: content.asJson,
        previewAsJson: content.asJson.content?.slice(0, 5) ?? {},
      })
      .execute();

    const resultRichtext = await this.getContent(content.contentId);

    return resultRichtext;
  }

  /**
   * Atualiza um conteúdo de texto complexo
   */
  async updateContent(content: UpdateContentRichText, by: Contributor['id']): Promise<ContentRichText> {
    const updatedAt = new Date().toISOString();

    const richText = content.asJson;

    if (typeof richText === 'undefined') {
      log.error('Erro ao atualizar conteúdo de rich text com id = ' + content.contentId);
      throw new Error('Erro ao atualizar conteúdo de rich text com id = ' + content.contentId);
    }

    return db.transaction(async tx => {
      try {
        const preview = richText?.content?.slice(0, 5) ?? {};

        const oldContent = await this.getContent(content.contentId);

        await tx
          .update(contentRichTextTable)
          .set({
            asJson: richText,
            previewAsJson: preview,
            updatedAt,
          })
          .where(eq(contentRichTextTable.contentId, content.contentId))
          .execute();

        const diff = diffJson(oldContent.asJson, richText);

        await tx
          .update(contentContributionTable)
          .set({
            userId: by,
            diff: diff,
            contentId: content.contentId,
            contributedAt: updatedAt,
          })
          .where(eq(contentContributionTable.contentId, content.contentId))
          .execute();

        const resultRichtext = await this.getContent(content.contentId);

        return resultRichtext;
      } catch (error) {
        log.error('Erro ao atualizar conteúdo de rich text com id = ' + content.contentId);
        throw new Error('Erro ao atualizar conteúdo de rich text com id = ' + content.contentId);
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
