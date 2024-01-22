import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getCommentsOnContentUseCase } from '../use-cases/get-comments-on-content-use-case';
import { getCommentsResponsesUseCase } from '../use-cases/get-comments-responses-use-case';

export const COMMENTS_QUERY_KEY = 'comments';

type CommentsQueryOptions = Pick<UseQueryOptions, 'enabled'>;

export function useCommentsQuery(contentId: number, commentId: number | null, options?: CommentsQueryOptions) {
  return useQuery({
    queryKey: [COMMENTS_QUERY_KEY, contentId, commentId],
    queryFn: () => {
      if (commentId) {
        return getCommentsResponsesUseCase(commentId);
      } else {
        return getCommentsOnContentUseCase(contentId);
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnMount: false,
    ...options,
  });
}
