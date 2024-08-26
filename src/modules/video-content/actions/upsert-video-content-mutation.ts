'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { log } from '@/modules/logging/lib/pino';
import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import {
  newVideoContentSchema,
  type NewVideoContentSchema,
} from '@/modules/video-content/schemas/new-video-content-schema';
import { fail, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertVideoContentMutation(params: NewVideoContentSchema): Promise<Result<number>> {
  const { user } = await validateRequest();

  if (!user) {
    return fail('Você precisa estar logado para criar um conteúdo de vídeo.');
  }

  const validatedParams = newVideoContentSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para cadastro de conteúdo de vídeo.');
  }

  const videoContentRepository = new VideoContentRepository();

  const newContentId = wrapAsyncInResult(
    videoContentRepository.upsert(
      { authorId: user.id, ...validatedParams.data },
      { src: validatedParams.data.src, description: validatedParams.data.description },
    ),
  );

  log.info('Conteúdo de vídeo criado com sucesso', { newContentId, userId: user.id });

  return newContentId;
}
