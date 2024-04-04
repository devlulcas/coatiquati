'use server';

import { CommentRepository } from '../repositories/comment-repository';
import type { Comment } from '../types/comment';

export async function getCommentResponsesQuery(commentId: number): Promise<Comment[]> {
  const commentRepository = new CommentRepository();
  return commentRepository.getCommentResponsesByCommentId(commentId);
}
