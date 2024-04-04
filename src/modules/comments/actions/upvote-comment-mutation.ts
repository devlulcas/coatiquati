import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { VOTES } from '../constants/votes';
import { CommentVoteRepository } from '../repositories/comment-vote-repository';

export async function upvoteCommentMutation(commentId: number): Promise<void> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    log.warn('Tentativa de votar em comentário sem usuário logado.', { commentId });
    throw new Error('Somente usuários logados podem votar em comentários.');
  }

  const commentVoteRepository = new CommentVoteRepository();

  const currentUserVote = await commentVoteRepository.getUserVote(commentId, session.userId);

  if (currentUserVote === VOTES.UPVOTE) {
    return commentVoteRepository.removeVote(commentId, session.userId);
  }

  return commentVoteRepository.upvote(commentId, session.userId);
}
