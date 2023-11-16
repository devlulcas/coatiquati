import type { Session } from '@/modules/auth/types/session';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentImage, NewContent } from '@/modules/content/types/content';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import {
  newImageContentSchema,
  type NewImageContentSchema,
} from '@/modules/image-content/schemas/new-image-content-schema';

export async function createNewImageContentUseCase(
  params: NewImageContentSchema,
  session: Session,
): Promise<ContentImage> {
  const validatedParams = newImageContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new ImageContentRepository(new BaseContentRepository());

  const newBaseContent: NewContent = {
    authorId: session.userId,
    contentType: 'image',
    title: validatedParams.data.title,
    topicId: validatedParams.data.topicId,
  };

  const newImageContent = await repository.createContent(newBaseContent, validatedParams.data);

  return newImageContent;
}
