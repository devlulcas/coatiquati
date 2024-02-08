import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getCommentResponsesUseCase } from '../use-cases/get-comment-responses-use-case';
import { getCommentsOnContentUseCase } from '../use-cases/get-comments-on-content-use-case';

export const COMMENTS_QUERY_KEY = 'comments';

type CommentsQueryOptions = Pick<UseQueryOptions, 'enabled'>;

export function useCommentsQuery(contentId: number, commentId: number | null, options?: CommentsQueryOptions) {
  const queryKey = commentId ? [COMMENTS_QUERY_KEY, contentId, commentId] : [COMMENTS_QUERY_KEY, contentId];

  const queryFn = async () => {
    const session = await getPageSession();

    if (commentId) {
      return getCommentResponsesUseCase.execute(commentId, session);
    } else {
      return getCommentsOnContentUseCase.execute(contentId, session);
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
