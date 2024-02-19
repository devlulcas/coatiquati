import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { CommentRepository } from '../repositories/comment-repository';
import { CommentVoteRepository } from '../repositories/comment-vote-repository';
import type { CommentWithAuthor } from '../types/comment';

export class GetCommentsOnContentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository = new CommentRepository(),
    private readonly commentVoteRepository: CommentVoteRepository = new CommentVoteRepository(),
  ) {}

  execute(contentId: number, session: Session | null): CommentWithAuthor[] {
    const comment = this.commentRepository.getCommentsByContentId(contentId);

    console.log('comment', comment);

    if (session && isAuthenticated(session)) {
      const votes = comment.map(comment => {
        const vote = this.commentVoteRepository.getUserVote(comment.id, session.userId);
        return vote === undefined ? 0 : vote;
      });

      return comment.map((comment, index) => ({ ...comment, userVote: votes[index] }));
    }

    return comment;
  }
}

export const getCommentsOnContentUseCase = new GetCommentsOnContentUseCase();
