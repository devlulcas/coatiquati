import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { db } from '@/modules/database/db';
import {
  contentImageTable,
  type ContentImageInsert,
  type ContentImageSelect,
  type ContentInsert,
} from '@/modules/database/schema/content';
import { log } from '@/modules/logging/lib/pino';

export class ImageContentRepository {
  constructor(private readonly baseContentRepository: BaseContentRepository = new BaseContentRepository()) {}

  async getByContentId(contentId: number): Promise<ContentImageSelect> {
    const image = await db.query.contentImageTable.findFirst({
      where: (fields, operators) => operators.eq(fields.baseContentId, contentId),
    });

    if (!image) {
      log.error('Imagem não encontrada', { contentId });
      throw new Error('Imagem não encontrada');
    }

    return image;
  }

  async upsert(baseContent: ContentInsert, image: Omit<ContentImageInsert, 'baseContentId'>): Promise<number> {
    return db.transaction(async tx => {
      try {
        const newContentId = await this.baseContentRepository.upsertBaseContent(baseContent, tx);

        await tx
          .insert(contentImageTable)
          .values({
            id: image.id,
            baseContentId: newContentId,
            description: image.description,
            src: image.src,
          })
          .onConflictDoUpdate({ target: [contentImageTable.baseContentId, contentImageTable.id], set: image })
          .execute();

        return newContentId;
      } catch (error) {
        log.error('Erro ao criar conteúdo de imagem.', { baseContent, image, error });
        tx.rollback();
        throw new Error('Erro ao criar conteúdo de imagem.');
      }
    });
  }
}
