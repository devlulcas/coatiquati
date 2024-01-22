'use server';

import type { Session } from '@/modules/auth/types/session';
import { CommentRepository } from '../repositories/comment-repository';

export async function downvoteCommentUseCase(
  commentId: number,
  session: Session,
  commentRepository: CommentRepository = new CommentRepository(),
) {
  return commentRepository.downvoteComment(session.userId, commentId);
}
