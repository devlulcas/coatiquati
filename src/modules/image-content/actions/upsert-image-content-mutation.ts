'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { ContentType } from '@/modules/content/types/content-json-field';
import {
  newImageContentSchema,
  type NewImageContentSchema,
} from '@/modules/image-content/schemas/new-image-content-schema';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, isOk, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertImageContentMutation(params: NewImageContentSchema): Promise<Result<number>> {
  const { data: user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Usuário não autenticado');
  }

  const validated = newImageContentSchema.safeParse(params);

  if (!validated.success) {
    log.error('Falha ao validar parâmetros.', { params, errors: validated.error });
    return fail(validated.error.message);
  }

  const repo = new BaseContentRepository();

  const author = validated.data.id ? await repo.getAuthorId(validated.data.id) : null;

  const newAuthorId = author && isOk(author) ? author.value : user.id;

  const newContentId = await wrapAsyncInResult(
    repo.upsertBaseContent({
      contentType: ContentType.Image,
      id: validated.data.id,
      title: params.title,
      topicId: params.topicId,
      authorId: newAuthorId,
      content: { description: params.description, src: params.src },
    }),
  );

  if (isFail(newContentId)) {
    log.error('Falha ao alterar conteúdo de imagem.', newContentId.fail);
    return fail('Falha ao alterar conteúdo de imagem.');
  }

  log.info('Conteúdo de imagem alterado com sucesso.', newContentId.value);

  return newContentId;
}
