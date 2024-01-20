'use server';

import { CommentRepository } from '../repositories/comment-repository';

export async function getCommentsOnContentUseCase(
  contentId: number,
  commentRepository: CommentRepository = new CommentRepository(),
) {
  return commentRepository.getCommentsByContentId(contentId);
}
