'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import { type NewRichTextContentSchema } from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';

export async function upsertRichTextContentMutation(params: NewRichTextContentSchema): Promise<number> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado');
  }

  const richTextContentRepository = new RichTextContentRepository();

  const newContentId = richTextContentRepository.upsert(
    { title: params.title, topicId: params.topicId, authorId: session.userId },
    params.content,
  );

  log.info('Conteúdo de rich text alterado com sucesso.', { newContentId });

  return newContentId;
}
