'use server';

import { CommentRepository } from '../repositories/comment-repository';

export async function getCommentsResponsesUseCase(
  commentId: number,
  commentRepository: CommentRepository = new CommentRepository(),
) {
  return commentRepository.getCommentResponsesByCommentId(commentId);
}
