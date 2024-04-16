'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import {
  newImageContentSchema,
  type NewImageContentSchema,
} from '@/modules/image-content/schemas/new-image-content-schema';
import { log } from '@/modules/logging/lib/pino';
import { fail, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertImageContentMutation(params: NewImageContentSchema): Promise<Result<number>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Usuário não autenticado');
  }

  const validatedParams = newImageContentSchema.safeParse(params);

  if (!validatedParams.success) {
    log.error('Falha ao validar parâmetros.', { params, errors: validatedParams.error });
    return fail(validatedParams.error.message);
  }

  const imageContentRepository = new ImageContentRepository();

  const newContentId = await wrapAsyncInResult(
    imageContentRepository.upsert(
      { title: params.title, topicId: params.topicId, authorId: session.userId },
      { description: params.description, src: params.src },
    ),
  );

  if (newContentId.type === 'fail') {
    log.error('Falha ao alterar conteúdo de imagem.', newContentId.fail);
    return fail('Falha ao alterar conteúdo de imagem.');
  }

  log.info('Conteúdo de imagem alterado com sucesso.', newContentId.value);

  return newContentId;
}
