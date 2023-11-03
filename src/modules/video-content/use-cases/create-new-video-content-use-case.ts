import type { Session } from '@/modules/auth/types/session';
import { DrizzleBaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentVideo, NewContent } from '@/modules/content/types/content';
import { DrizzleVideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import {
  newVideoContentSchema,
  type NewVideoContentSchema,
} from '@/modules/video-content/schemas/new-video-content-schema';

export async function createNewVideoContentUseCase(
  params: NewVideoContentSchema,
  session: Session,
): Promise<ContentVideo> {
  const validatedParams = newVideoContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleVideoContentRepository(new DrizzleBaseContentRepository());

  const newBaseContent: NewContent = {
    authorId: session.userId,
    contentType: 'video',
    title: validatedParams.data.title,
    topicId: validatedParams.data.topicId,
  };

  const newVideoContent = await repository.createContent(newBaseContent, validatedParams.data);

  return newVideoContent;
}
