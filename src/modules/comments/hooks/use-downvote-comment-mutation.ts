import { useMutation, useQueryClient } from '@tanstack/react-query';
import { downvoteCommentAction } from '../components/comment-vote-block/vote-comment-action';
import { COMMENTS_QUERY_KEY } from './use-comments-query';

export function useDownvoteCommentMutation(contentId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => downvoteCommentAction(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries([COMMENTS_QUERY_KEY, contentId, commentId]);
    },
  });
}
