'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { log } from '@/modules/logging/lib/pino';
import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import {
  newVideoContentSchema,
  type NewVideoContentSchema,
} from '@/modules/video-content/schemas/new-video-content-schema';

export async function upsertVideoContentMutation(params: NewVideoContentSchema): Promise<number> {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar um conteúdo de vídeo.');
  }

  const validatedParams = newVideoContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para cadastro de conteúdo de vídeo.');
  }

  const videoContentRepository = new VideoContentRepository();
  const newContentId = await videoContentRepository.upsert(
    { authorId: session.userId, ...validatedParams.data },
    { src: validatedParams.data.src, description: validatedParams.data.description },
  );

  log.info('Conteúdo de vídeo criado com sucesso', { newContentId, userId: session.userId });

  return newContentId;
}
