import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { db } from '@/modules/database/db';
import {
  contentVideoTable,
  type ContentInsert,
  type ContentVideoInsert,
  type ContentVideoSelect,
} from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';

export class VideoContentRepository {
  constructor(private readonly baseContentRepository: BaseContentRepository = new BaseContentRepository()) {}

  async getByContentId(contentId: number): Promise<ContentVideoSelect> {
    const video = await db.query.contentVideoTable.findFirst({
      where: (fields, operators) => operators.eq(fields.baseContentId, contentId),
    });

    if (!video) {
      log.error('Video não encontrado', { contentId });
      throw new Error('Video não encontrado');
    }

    return video;
  }

  async upsert(baseContent: ContentInsert, video: Omit<ContentVideoInsert, 'baseContentId'>): Promise<number> {
    return db.transaction(async tx => {
      try {
        const newContentId = await this.baseContentRepository.upsertBaseContent(baseContent, tx);

        await tx
          .insert(contentVideoTable)
          .values({
            id: video.id,
            baseContentId: newContentId,
            description: video.description,
            src: video.src,
          })
          .onConflictDoUpdate({ target: [contentVideoTable.baseContentId, contentVideoTable.id], set: video })
          .execute();

        return newContentId;
      } catch (error) {
        log.error('Erro ao criar conteúdo de video.', { baseContent, video, error });
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de video.');
      }
    });
  }
}
