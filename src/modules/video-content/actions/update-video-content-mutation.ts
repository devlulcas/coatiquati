'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import type { ContentVideo, UpdateContent, UpdateContentVideo } from '@/modules/content/types/content';
import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import {
  updateVideoContentSchema,
  type UpdateVideoContentSchema,
} from '@/modules/video-content/schemas/edit-video-content-schema';

export async function updateVideoContentMutation(params: UpdateVideoContentSchema): Promise<ContentVideo> {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar um conteúdo de vídeo.');
  }

  const validatedParams = updateVideoContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

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

  const videoContentRepository = new VideoContentRepository();

  const newVideoContent = await videoContentRepository.updateContent(newBaseContent, update);

  return newVideoContent;
}
