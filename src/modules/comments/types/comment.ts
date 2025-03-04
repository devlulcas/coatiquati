import type { Comment as CommentTable } from '@/modules/database/schema/comment';
import type { Contributor } from '@/modules/user/types/user';

export type Comment = CommentTable & {
  author: Contributor;
};
