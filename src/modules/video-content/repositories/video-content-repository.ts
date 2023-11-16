import type { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type {
  ContentVideo,
  NewContent,
  NewContentVideo,
  UpdateContent,
  UpdateContentVideo,
} from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { contentVideoTable } from '@/modules/database/schema/content';
import { contentContributionTable } from '@/modules/database/schema/contribution';
import { eq } from 'drizzle-orm';

export const VIDEO_CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  description: true,
  contentId: true,
  src: true,
  alt: true,
});

export class VideoContentRepository {
  constructor(private readonly baseContentRepository: BaseContentRepository) {}

  /**
   * Busca um conteúdo de vídeo com base no seu id
   */
  async getContent(contentId: number, database = db): Promise<ContentVideo> {
    const resultVideo: ContentVideo | undefined = await database.query.contentVideoTable.findFirst({
      columns: VIDEO_CONTENT_DB_FIELDS,
      where(fields, operators) {
        return operators.eq(fields.contentId, contentId);
      },
    });

    if (!resultVideo) {
      throw new Error('Erro ao buscar conteúdo de vídeo com id = ' + contentId);
    }

    return resultVideo;
  }

  /**
   * Cria um conteúdo de vídeo
   */
  async createContent(baseContent: NewContent, video: NewContentVideo, database = db): Promise<ContentVideo> {
    const contentId = await database.transaction(async tx => {
      try {
        const insertedContentId = await this.baseContentRepository.createBaseContent(baseContent, tx);

        await tx
          .insert(contentVideoTable)
          .values({
            contentId: insertedContentId,
            alt: video.alt,
            description: video.description,
            src: video.src,
          })
          .execute();

        return insertedContentId;
      } catch (error) {
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de video');
      }
    });

    return this.getContent(contentId);
  }

  /**
   * Atualiza um conteúdo de texto complexo
   */
  async updateContent(baseContent: UpdateContent, video?: UpdateContentVideo, database = db): Promise<ContentVideo> {
    const updatedAt = new Date().toISOString();

    if (typeof video === 'undefined') {
      throw new Error('Erro ao atualizar conteúdo de vídeo com id = ' + baseContent.id);
    }

    return database.transaction(async tx => {
      try {
        await this.baseContentRepository.updateBaseContent(baseContent, tx);

        await tx
          .update(contentVideoTable)
          .set({
            alt: video.alt,
            description: video.description,
            src: video.src,
            updatedAt: updatedAt,
          })
          .where(eq(contentVideoTable.contentId, baseContent.id))
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

        const resultVideo = await this.getContent(baseContent.id, tx);

        return resultVideo;
      } catch (error) {
        tx.rollback();
        throw new Error('Erro ao atualizar conteúdo de video com id = ' + baseContent.id);
      }
    });
  }
}
