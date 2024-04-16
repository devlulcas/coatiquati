'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { VOTES } from '../constants/votes';
import { CommentVoteRepository } from '../repositories/comment-vote-repository';

export async function downvoteCommentMutation(commentId: number): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    log.warn('Tentativa de votar em comentário sem usuário logado.', { commentId });
    return fail('Somente usuários logados podem votar em comentários.');
  }

  const commentVoteRepository = new CommentVoteRepository();

  const currentUserVoteResult = await wrapAsyncInResult(commentVoteRepository.getUserVote(commentId, session.userId));

  if (currentUserVoteResult.type === 'fail') {
    return fail('Erro ao buscar voto do usuário.');
  }

  try {
    if (currentUserVoteResult.value === VOTES.DOWNVOTE) {
      await commentVoteRepository.removeVote(commentId, session.userId);
      return ok('Voto removido.');
    }

    await commentVoteRepository.downvote(commentId, session.userId);
    return ok('Voto computado.');
  } catch (error) {
    log.error('Erro ao votar em comentário.', { commentId, userId: session.userId, error });
    return fail('Erro ao votar em comentário.');
  }
}
