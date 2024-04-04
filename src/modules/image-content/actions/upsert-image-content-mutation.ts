'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import { type NewImageContentSchema } from '@/modules/image-content/schemas/new-image-content-schema';
import { log } from '@/modules/logging/lib/pino';

export async function upsertImageContentMutation(params: NewImageContentSchema): Promise<number> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado');
  }

  const imageContentRepository = new ImageContentRepository();

  const newContentId = imageContentRepository.upsert(
    { title: params.title, topicId: params.topicId, authorId: session.userId },
    { description: params.description, src: params.src },
  );

  log.info('Conteúdo de imagem alterado com sucesso.', { newContentId });

  return newContentId;
}
