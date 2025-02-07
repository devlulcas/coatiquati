'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { ContentType } from '@/modules/content/types/content-json-field';
import { log } from '@/modules/logging/lib/pino';
import { newRichTextContentSchema, type NewRichTextContentSchema } from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';
import { fail, isFail, isOk, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertRichTextContentMutation(params: NewRichTextContentSchema): Promise<Result<number>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Usuário não autenticado');
  }

  const validated = newRichTextContentSchema.safeParse(params);

  if (!validated.success) {
    log.error('Falha ao validar parâmetros.', { params, errors: validated.error });
    return fail(validated.error.message);
  }

  const repo = new BaseContentRepository();

  const author = validated.data.id ? await repo.getAuthorId(validated.data.id) : null

  const newAuthorId = author && isOk(author) ? author.value : user.id

  const newContentId = await wrapAsyncInResult(
    repo.upsertBaseContent({
      contentType: ContentType.RichText,
      id: validated.data.id,
      title: params.title,
      topicId: params.topicId,
      authorId: newAuthorId,
      content: validated.data.content,
    }),
  );

  if (isFail(newContentId)) {
    log.error('Falha ao alterar conteúdo de texto rico', newContentId.fail);
    return fail('Falha ao alterar textual');
  }

  log.info('Conteúdo de rich text alterado com sucesso.', newContentId.value);

  return newContentId;
}
