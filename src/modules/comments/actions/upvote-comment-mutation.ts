'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { VOTES } from '../constants/votes';
import { CommentVoteRepository } from '../repositories/comment-vote-repository';

export async function upvoteCommentMutation(commentId: number): Promise<Result<string>> {
  const { data: user } = await validateRequest();

  if (!isAuthenticated(user)) {
    log.warn('Tentativa de votar em comentário sem usuário logado.', { commentId });
    return fail('Somente usuários logados podem votar em comentários.');
  }

  const commentVoteRepository = new CommentVoteRepository();

  const currentUserVote = await wrapAsyncInResult(commentVoteRepository.getUserVote(commentId, user.id));

  if (isFail(currentUserVote)) {
    return fail('Erro ao buscar voto do usuário.');
  }

  try {
    if (currentUserVote.value === VOTES.UPVOTE) {
      await commentVoteRepository.removeVote(commentId, user.id);
      return ok('Voto removido.');
    }

    await commentVoteRepository.upvote(commentId, user.id);
    return ok('Voto computado.');
  } catch (error) {
    log.error('Erro ao votar em comentário.', { commentId, userId: user.id, error });
    return fail('Erro ao votar em comentário.');
  }
}
