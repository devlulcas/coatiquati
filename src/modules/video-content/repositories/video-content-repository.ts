import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentVideo, NewContent, NewContentVideo, UpdateContentVideo } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { contentVideoTable, type NewContentTable } from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';
import type { WithOptionalID } from '@/shared/utils/with';
import { eq } from 'drizzle-orm';

export const VIDEO_CONTENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  description: true,
  contentId: true,
  src: true,
  alt: true,
});

export class VideoContentRepository {
  constructor(private readonly baseContentRepository: BaseContentRepository = new BaseContentRepository()) {}

  async getContent(contentId: number): Promise<ContentVideo> {
    const resultVideo = await db
      .select()
      .from(contentVideoTable)
      .where(eq(contentVideoTable.baseContentId, contentId))
      .get();

    if (!resultVideo) {
      log.error('Erro ao buscar conteúdo de vídeo', { contentId });
      throw new Error('Erro ao buscar conteúdo de vídeo com id = ' + contentId);
    }

    return resultVideo;
  }

  async createContent(baseContent: NewContent, video: NewContentVideo): Promise<number> {
    return await db.transaction(async tx => {
      try {
        const insertedContentId = await this.baseContentRepository.upsertBaseContent(baseContent, tx);

        await tx
          .insert(contentVideoTable)
          .values({ baseContentId: insertedContentId, description: video.description, src: video.src })
          .execute();

        return insertedContentId;
      } catch (error) {
        log.error('Erro ao criar conteúdo de vídeo', { baseContent, video, error });
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de video');
      }
    });
  }

  async updateContent(baseContent: WithOptionalID<NewContentTable>, video: UpdateContentVideo): Promise<ContentVideo> {
    return db.transaction(async tx => {
      try {
        await this.baseContentRepository.upsertBaseContent(baseContent, tx);

        await tx
          .update(contentVideoTable)
          .set({
            alt: video.alt,
            description: video.description,
            src: video.src,
            updatedAt: updatedAt,
          })
          .where(eq(contentVideoTable.baseContentId, baseContent.id))
          .execute();

        const resultVideo = await this.getContent(baseContent.id, tx);

        return resultVideo;
      } catch (error) {
        log.error('Erro ao atualizar conteúdo de vídeo', { baseContent, video, error });
        tx.rollback();
        throw new Error('Erro ao atualizar conteúdo de video com id = ' + baseContent.id);
      }
    });
  }
}
