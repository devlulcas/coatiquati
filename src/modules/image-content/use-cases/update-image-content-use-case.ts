import type { Session } from '@/modules/auth/types/session';
import { DrizzleBaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentImage, UpdateContent, UpdateContentImage } from '@/modules/content/types/content';
import { DrizzleImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import {
  updateImageContentSchema,
  type UpdateImageContentSchema,
} from '@/modules/image-content/schemas/edit-image-content-schema';

export async function updateImageContentUseCase(
  params: UpdateImageContentSchema,
  session: Session,
): Promise<ContentImage> {
  const validatedParams = updateImageContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleImageContentRepository(new DrizzleBaseContentRepository());

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

  const newImageContent = await repository.updateContent(newBaseContent, update);

  return newImageContent;
}
