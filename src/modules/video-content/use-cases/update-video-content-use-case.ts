import type { Session } from '@/modules/auth/types/session';
import { DrizzleBaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentVideo, UpdateContent, UpdateContentVideo } from '@/modules/content/types/content';
import { DrizzleVideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import {
  updateVideoContentSchema,
  type UpdateVideoContentSchema,
} from '@/modules/video-content/schemas/edit-video-content-schema';

export async function updateVideoContentUseCase(
  params: UpdateVideoContentSchema,
  session: Session,
): Promise<ContentVideo> {
  const validatedParams = updateVideoContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleVideoContentRepository(new DrizzleBaseContentRepository());

  const newBaseContent: UpdateContent = {
    contributorId: session.userId,
    id: validatedParams.data.id,
    title: validatedParams.data.title,
    topicId: validatedParams.data.topicId,
  };

  const update: UpdateContentVideo = {
    src: validatedParams.data.src,
    alt: validatedParams.data.alt,
    description: validatedParams.data.description,
  };

  const newVideoContent = await repository.updateContent(newBaseContent, update);

  return newVideoContent;
}
