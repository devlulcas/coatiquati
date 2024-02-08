import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { CommentRepository } from '../repositories/comment-repository';
import { CommentVoteRepository } from '../repositories/comment-vote-repository';
import type { CommentWithAuthor } from '../types/comment';

export class GetCommentResponsesUseCase {
  constructor(
    private readonly commentRepository: CommentRepository = new CommentRepository(),
    private readonly commentVoteRepository: CommentVoteRepository = new CommentVoteRepository(),
  ) {}

  execute(commentId: number, session: Session | null): CommentWithAuthor[] {
    const responses = this.commentRepository.getCommentResponsesByCommentId(commentId);

    if (session && isAuthenticated(session)) {
      const votes = responses.map(comment => {
        const vote = this.commentVoteRepository.getUserVote(comment.id, session.userId);
        return vote === undefined ? 0 : vote;
      });

      return responses.map((response, index) => ({ ...response, userVote: votes[index] }));
    }

    return responses;
  }
}

export const getCommentResponsesUseCase = new GetCommentResponsesUseCase();
