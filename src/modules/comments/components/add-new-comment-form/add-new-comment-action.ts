'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import type { NewCommentSchema } from '../../schemas/new-comment-schema';
import { commentOnContentUseCase } from '../../use-cases/comment-on-content-use-case';

export async function addNewCommentAction(data: NewCommentSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para comentar.');
  }

  await commentOnContentUseCase.execute(data, session);
}
