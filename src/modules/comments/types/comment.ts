import type { ContentCommentTable } from '@/modules/database/schema/comment';
import type { Contributor } from '@/modules/user/types/user';

export type CommentWithAuthor = Omit<ContentCommentTable, 'authorId' | 'deletedAt'> & {
  author: Contributor;
  currentUserVote?: 1 | -1 | 0;
  upvotes: number;
  downvotes: number;
  upvoteCount: number;
  downvoteCount: number;
};

export type CommentWithAuthorSelect = {
  id: number;
  createdAt: string;
  updatedAt: string;
  contentId: number;
  content: string;
  parentCommentId: number | null;
  upvotes: number;
  downvotes: number;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  } | null;
};
