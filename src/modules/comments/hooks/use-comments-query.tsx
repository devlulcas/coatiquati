import { useQuery } from '@tanstack/react-query';
import { getCommentsOnContentUseCase } from '../use-cases/get-comments-on-content-use-case';

export const COMMENTS_QUERY_KEY = 'comments';
export function useCommentsQuery(contentId: number, commentId: number | null) {
  return useQuery({
    queryKey: [COMMENTS_QUERY_KEY, contentId, commentId],
    queryFn: () => {
      if (commentId) {
        return [];
      } else {
        return getCommentsOnContentUseCase(contentId);
      }
    },
  });
}
