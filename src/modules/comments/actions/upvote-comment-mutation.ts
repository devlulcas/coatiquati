'use server';

import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { VOTES } from '../constants/votes';
import { CommentVoteRepository } from '../repositories/comment-vote-repository';

export async function upvoteCommentMutation(commentId: number): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(session)) {
    log.warn('Tentativa de votar em comentário sem usuário logado.', { commentId });
    return fail('Somente usuários logados podem votar em comentários.');
  }

  const commentVoteRepository = new CommentVoteRepository();

  const currentUserVote = await wrapAsyncInResult(commentVoteRepository.getUserVote(commentId, session.userId));

  if (currentUserVote.type === 'fail') {
    return fail('Erro ao buscar voto do usuário.');
  }

  try {
    if (currentUserVote.value === VOTES.UPVOTE) {
      await commentVoteRepository.removeVote(commentId, session.userId);
      return ok('Voto removido.');
    }

    await commentVoteRepository.upvote(commentId, session.userId);
    return ok('Voto computado.');
  } catch (error) {
    log.error('Erro ao votar em comentário.', { commentId, userId: session.userId, error });
    return fail('Erro ao votar em comentário.');
  }
}
