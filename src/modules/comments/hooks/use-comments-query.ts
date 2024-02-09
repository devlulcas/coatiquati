import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { CommentWithAuthor } from '../types/comment';

export const COMMENTS_QUERY_KEY = 'comments';

type CommentsQueryOptions = Pick<UseQueryOptions, 'enabled'>;

const fetchCommentsOnContent = async (contentId: number) => {
  const response = await fetch(`/api/contents/${contentId}/comments`);
  return response.json();
};

const fetchCommentResponses = async (commentId: number) => {
  const response = await fetch(`/api/comments/${commentId}`);
  return response.json();
};

export function useCommentsQuery(contentId: number, commentId: number | null, options?: CommentsQueryOptions) {
  const queryKey = commentId ? [COMMENTS_QUERY_KEY, contentId, commentId] : [COMMENTS_QUERY_KEY, contentId];

  const queryFn = async (): Promise<CommentWithAuthor[]> => {
    if (commentId) {
      return fetchCommentResponses(commentId);
    } else {
      return fetchCommentsOnContent(contentId);
    }
  };

  return useQuery({
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnMount: false,
    ...options,
  });
}
