import type { ContentCommentTable } from '@/modules/database/schema/comment';
import type { Contributor } from '@/modules/user/types/user';

export type CommentWithAuthor = Omit<ContentCommentTable, 'authorId' | 'deletedAt'> & {
  author: Contributor;
};

export type CommentWithAuthorSelect = {
  id: number;
  createdAt: string;
  updatedAt: string;
  contentId: number;
  content: string;
  parentCommentId: number | null;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  } | null;
};

export type CommentWithAuthorAndVote = CommentWithAuthor & {
  userVote: number;
  votes: number;
};
