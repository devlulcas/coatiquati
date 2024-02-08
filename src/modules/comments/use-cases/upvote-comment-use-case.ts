import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { CommentVoteRepository } from '../repositories/comment-vote-repository';

export class UpvoteCommentUseCase {
  constructor(private readonly commentVoteRepository: CommentVoteRepository = new CommentVoteRepository()) {}

  async execute(commentId: number, session: Session) {
    if (!isAuthenticated(session)) {
      throw new Error('Somente usuários logados podem votar em comentários.');
    }

    const currentUserVote = await this.commentVoteRepository.getUserVote(commentId, session.userId);

    if (currentUserVote === 1) {
      await this.commentVoteRepository.voteComment(commentId, session.userId, 0);
      return null;
    }

    if (currentUserVote === -1 || currentUserVote === 0) {
      await this.commentVoteRepository.updateVote(commentId, session.userId, 1);
      return null;
    }

    await this.commentVoteRepository.voteComment(commentId, session.userId, 1);
  }
}

export const upvoteCommentUseCase = new UpvoteCommentUseCase();
