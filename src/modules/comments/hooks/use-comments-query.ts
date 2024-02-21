import { env } from '@/env';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import type { CommentWithAuthor } from '../types/comment';

export const COMMENTS_QUERY_KEY = 'comments';

type CommentsQueryOptions = Pick<UseQueryOptions, 'enabled'>;

const fetchComments = async (contentId: number, commentId: number | null): Promise<CommentWithAuthor[]> => {
  const url = new URL('/api/comments', env.NEXT_PUBLIC_WEBSITE + '/api/comments');
  url.searchParams.set('content', contentId.toString());

  if (commentId) {
    url.searchParams.set('comment', commentId.toString());
  }

  const response = await fetch(url);

  return response.json();
};

export function useCommentsQuery(contentId: number, commentId: number | null, options?: CommentsQueryOptions) {
  return useQuery({
    queryKey: [COMMENTS_QUERY_KEY, contentId, commentId],
    queryFn: () => fetchComments(contentId, commentId),
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnMount: false,
    ...options,
  });
}
