import type { ContentImage, NewContent, NewContentImage, UpdateContent } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { contentImageTable } from '@/modules/database/schema/content';
import { contentContributionTable } from '@/modules/database/schema/contribution';
import { eq } from 'drizzle-orm';
import type { DrizzleBaseContentRepository } from './base-content-repository';

export type ImageContentRepository = {
  getContent(contentId: number): Promise<ContentImage>;
  createContent(baseContent: NewContent, image: NewContentImage): Promise<ContentImage>;
  updateContent(baseContent: UpdateContent, image?: ContentImage): Promise<ContentImage> 
};

export const IMAGE_CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  description: true,
  contentId: true,
  src: true,
  alt: true,
});

export class DrizzleImageContentRepository implements ImageContentRepository {
  constructor(private readonly baseContentRepository: DrizzleBaseContentRepository) {}

  /**
   * Busca um conteúdo de imagem com base no seu id
   */
  async getContent(contentId: number, database = db): Promise<ContentImage> {
    const resultImage: ContentImage | undefined = await database.query.contentImageTable.findFirst({
      columns: IMAGE_CONTENT_DB_FIELDS,
      where(fields, operators) {
        return operators.eq(fields.contentId, contentId);
      },
    });

    if (!resultImage) {
      throw new Error('Erro ao buscar conteúdo de rich text com id = ' + contentId);
    }

    return resultImage;
  }

  /**
   * Cria um conteúdo de texto complexo
   */
  async createContent(baseContent: NewContent, image: NewContentImage, database = db): Promise<ContentImage> {
    const contentId = await database.transaction(async tx => {
      try {
        const insertedContentId = await this.baseContentRepository.createBaseContent(baseContent, tx);

        await tx
          .insert(contentImageTable)
          .values({
            contentId: insertedContentId,
            alt: image.alt,
            description: image.description,
            src: image.src,
          })
          .execute();

        return insertedContentId;
      } catch (error) {
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de imagem com id = ' + image.contentId);
      }
    });

    return this.getContent(contentId);
  }

  /**
   * Atualiza um conteúdo de texto complexo
   */
  async updateContent(baseContent: UpdateContent, image?: ContentImage, database = db): Promise<ContentImage> {
    const updatedAt = new Date().toISOString();

    if (typeof image === 'undefined') {
      throw new Error('Erro ao atualizar conteúdo de rich text com id = ' + baseContent.id);
    }

    return database.transaction(async tx => {
      try {
        await this.baseContentRepository.updateBaseContent(baseContent, tx);

        await tx
          .update(contentImageTable)
          .set({
            alt: image.alt,
            description: image.description,
            src: image.src,
            updatedAt: updatedAt,
          })
          .where(eq(contentImageTable.contentId, baseContent.id))
          .execute();

        await tx
          .update(contentContributionTable)
          .set({
            userId: baseContent.contributorId,
            contentId: baseContent.id,
            contributedAt: updatedAt,
          })
          .where(eq(contentContributionTable.contentId, baseContent.id))
          .execute();

        const resultImage = await this.getContent(baseContent.id, tx);

        return resultImage;
      } catch (error) {
        tx.rollback();
        throw new Error('Erro ao atualizar conteúdo de imagem com id = ' + baseContent.id);
      }
    });
  }
}
