'use server';

import { CommentRepository } from '../repositories/comment-repository';
import type { Comment } from '../types/comment';

export async function getCommentsOnContentQuery(contentId: number): Promise<Comment[]> {
  const commentRepository = new CommentRepository();
  return commentRepository.getRootComments(contentId);
}
