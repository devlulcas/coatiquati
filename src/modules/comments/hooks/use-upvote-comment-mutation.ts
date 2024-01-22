import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upvoteCommentAction } from '../components/comment-vote-block/vote-comment-action';
import { COMMENTS_QUERY_KEY } from './use-comments-query';

export function useUpvoteCommentMutation(contentId: number, commentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => upvoteCommentAction(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries([COMMENTS_QUERY_KEY, contentId, commentId]);
    },
  });
}
