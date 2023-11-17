import type { Session } from '@/modules/auth/types/session';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentImage, NewContent } from '@/modules/content/types/content';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import {
  newImageContentSchema,
  type NewImageContentSchema,
} from '@/modules/image-content/schemas/new-image-content-schema';
import { log } from '@/modules/logging/lib/pino';

export class CreateNewImageContentUseCase {
  constructor(private readonly imageContentRepository: ImageContentRepository = new ImageContentRepository()) {}

  async execute(params: NewImageContentSchema, session: Session): Promise<ContentImage> {
    const validatedParams = newImageContentSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos');
    }

    const newBaseContent: NewContent = {
      authorId: session.userId,
      contentType: 'image',
      title: validatedParams.data.title,
      topicId: validatedParams.data.topicId,
    };

    const newImageContent = await this.imageContentRepository.createContent(newBaseContent, validatedParams.data);

    log.info('Conteúdo de imagem criado com sucesso.', { newImageContentId: newImageContent.id });

    return newImageContent;
  }
}
