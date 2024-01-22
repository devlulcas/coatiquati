import type { ContentCommentTable } from '@/modules/database/schema/comment';
import type { Contributor } from '@/modules/user/types/user';

export type CommentWithAuthor = Omit<ContentCommentTable, 'authorId' | 'deletedAt'> & {
  author: Contributor;
};
