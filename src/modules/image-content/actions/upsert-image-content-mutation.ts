'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import {
  newImageContentSchema,
  type NewImageContentSchema,
} from '@/modules/image-content/schemas/new-image-content-schema';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertImageContentMutation(params: NewImageContentSchema): Promise<Result<number>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
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
      { title: params.title, topicId: params.topicId, authorId: user.id },
      { description: params.description, src: params.src },
    ),
  );

  if (isFail(newContentId)) {
    log.error('Falha ao alterar conteúdo de imagem.', newContentId.fail);
    return fail('Falha ao alterar conteúdo de imagem.');
  }

  log.info('Conteúdo de imagem alterado com sucesso.', newContentId.value);

  return newContentId;
}
