'use client';

import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { isOk } from '@/shared/lib/result';
import { cn } from '@/shared/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { downvoteCommentMutation } from '../../actions/downvote-comment-mutation';
import { getuserCommentVoteQuery } from '../../actions/get-user-comment-vote-query';
import { upvoteCommentMutation } from '../../actions/upvote-comment-mutation';
import type { Comment } from '../../types/comment';
import { AnswerCommentDrawerTrigger } from '../answer-comment-drawer-trigger';

type CommentBlockProps = {
  comment: Comment;
};

export function CommentBlock({ comment }: CommentBlockProps) {
  const query = useCommentResponsesQuery(comment.contentId, comment.id, true);

  return (
    <li className="flex flex-col gap-2 rounded bg-gradient-to-br from-background/75 to-background/50 pb-1 pt-1 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar className="h-8 w-8 rounded border border-secondary-foreground/25 text-xs" user={comment.author} />
          <p className="text-md font-bold">{comment.author.username}</p>
        </div>

        <div className="flex items-center gap-1">
          <VotingActions comment={comment} />

          <AnswerCommentDrawerTrigger originalComment={comment} />
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <p className="text-sm text-muted-foreground">{comment.content}</p>
      </div>

      {query.fetchStatus === 'fetching' && (
        <p className="flex h-12 items-center justify-center gap-2 text-muted-foreground">
          <Loader2Icon className="h-4 w-4 animate-spin" />
          Carregando...
        </p>
      )}

      {query.isError && (
        <p className="flex h-12 items-center justify-center rounded bg-destructive/5 text-destructive">
          Ocorreu um erro ao buscar as respostas:{' '}
          {query.error instanceof Error ? query.error.message : 'Erro desconhecido'}
        </p>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <ul className="flex flex-col gap-2 border-l border-border/25 pl-2">
          {query.data.map(response => (
            <CommentBlock key={response.id} comment={response} />
          ))}
        </ul>
      )}
    </li>
  );
}

function VotingActions({ comment }: { comment: Comment }) {
  const currentUserDataQuery = useCurrentUserDataQuery();

  const userVoteQuery = useQuery({
    queryKey: ['USER_COMMENT_VOTE_QUERY_KEY', comment.id],
    queryFn: () => getuserCommentVoteQuery(comment.id),
    enabled: !!currentUserDataQuery.data
  })

  const [currentVote, setCurrentVote] = useState(userVoteQuery.data && isOk(userVoteQuery.data) ? userVoteQuery.data.value : 0)

  const upvoteMutation = useServerActionMutation({
    serverAction: upvoteCommentMutation,
    onSuccessfulAction: () => {
      setCurrentVote(1)
    },
  });

  const downvoteMutation = useServerActionMutation({
    serverAction: downvoteCommentMutation,
    onSuccessfulAction: () => {
      setCurrentVote(-1)
    },
  });

  return (
    <>
      <Button
        size="sm"
        type="button"
        variant="outline"
        className={cn('flex items-center gap-2', currentVote === 1 && 'text-brand-500')}
        onClick={() => upvoteMutation.mutate(comment.id)}
      >
        {currentVote !== -1 ? <ThumbsUp size={16} /> : <ThumbsDown size={16} />}
        <span>{comment.voteCount}</span>
      </Button>
    </>
  );
}

async function fetchResponses(commentId: number): Promise<Comment[]> {
  const response = await fetch(`/api/comments/${commentId}/responses`);
  const responses = await response.json();
  return responses;
}

function useCommentResponsesQuery(contentId: number, commentId: number | undefined, active = false) {
  return useQuery({
    queryKey: ['comment-responses', contentId, commentId],
    queryFn: () => fetchResponses(commentId!),
    enabled: active && !!commentId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
}
