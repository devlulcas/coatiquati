import type { Session } from '@/modules/auth/types/session';
import type { ContentImage, UpdateContent, UpdateContentImage } from '@/modules/content/types/content';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import {
  updateImageContentSchema,
  type UpdateImageContentSchema,
} from '@/modules/image-content/schemas/edit-image-content-schema';
import { log } from '@/modules/logging/lib/pino';

export class UpdateImageContentUseCase {
  constructor(private readonly imageContentRepository: ImageContentRepository = new ImageContentRepository()) {}

  async execute(params: UpdateImageContentSchema, session: Session): Promise<ContentImage> {
    const validatedParams = updateImageContentSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para atualizar conteúdo de imagem.');
    }

    const newBaseContent: UpdateContent = {
      contributorId: session.userId,
      id: validatedParams.data.id,
      title: validatedParams.data.title,
      topicId: validatedParams.data.topicId,
    };

    const update: UpdateContentImage = {
      src: validatedParams.data.src,
      alt: validatedParams.data.alt,
      description: validatedParams.data.description,
    };

    const newImageContent = await this.imageContentRepository.updateContent(newBaseContent, update);

    log.info('Conteúdo de imagem atualizado com sucesso.', {
      contentId: newImageContent.id,
      contributorId: session.userId,
    });

    return newImageContent;
  }
}
