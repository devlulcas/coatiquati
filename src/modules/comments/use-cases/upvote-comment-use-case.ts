'use server';

import type { Session } from '@/modules/auth/types/session';
import { CommentRepository } from '../repositories/comment-repository';

export async function upvoteCommentUseCase(
  commentId: number,
  session: Session,
  commentRepository: CommentRepository = new CommentRepository(),
) {
  return commentRepository.upvoteComment(session.userId, commentId);
}
