'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { downvoteCommentUseCase } from '../../use-cases/downvote-comment-use-case';
import { upvoteCommentUseCase } from '../../use-cases/upvote-comment-use-case';

export async function upvoteCommentAction(commentId: number) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para votar.');
  }

  await upvoteCommentUseCase.execute(commentId, session);
}

export async function downvoteCommentAction(commentId: number) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para votar.');
  }

  await downvoteCommentUseCase.execute(commentId, session);
}
