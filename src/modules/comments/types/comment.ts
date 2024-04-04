import type { ContentCommentTable } from '@/modules/database/schema/comment';
import type { Contributor } from '@/modules/user/types/user';

export type Comment = ContentCommentTable & {
  author: Contributor;
  votes: {
    commentId: number;
    userId: string;
    vote: number;
  }[];
};
