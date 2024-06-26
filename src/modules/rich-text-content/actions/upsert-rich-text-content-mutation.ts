'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import { type NewRichTextContentSchema } from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';
import { fail, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertRichTextContentMutation(params: NewRichTextContentSchema): Promise<Result<number>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Usuário não autenticado');
  }

  const richTextContentRepository = new RichTextContentRepository();

  const newContentResult = await wrapAsyncInResult(
    richTextContentRepository.upsert(
      { title: params.title, topicId: params.topicId, authorId: session.userId },
      params.content,
    ),
  );

  if (newContentResult.type === 'fail') {
    log.error('Falha ao alterar conteúdo de texto rico', newContentResult.fail);
    return fail('Falha ao alterar textual');
  }

  log.info('Conteúdo de rich text alterado com sucesso.', newContentResult.value);

  return newContentResult;
}
