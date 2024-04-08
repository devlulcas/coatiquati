'use client';

import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { cn } from '@/shared/utils/cn';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownIcon, ArrowUpIcon, Loader2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { downvoteCommentMutation } from '../../actions/downvote-comment-mutation';
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
  const [votes, setVotes] = useState(comment.votes);

  const updateOrAddVote = (vote: { userId: string; vote: number }) => {
    setVotes(prevVotes => {
      const voteIndex = prevVotes.findIndex(v => v.userId === vote.userId);

      if (voteIndex === -1) {
        return [...prevVotes, vote];
      }

      const oldVote = prevVotes[voteIndex];

      if (oldVote.vote === vote.vote) {
        vote.vote = 0;
      }

      const newVotes = [...prevVotes];

      newVotes[voteIndex] = vote;

      return newVotes;
    });
  };

  const [upvoteCount, downvoteCount] = useMemo(() => {
    let upvoteCount = 0;
    let downvoteCount = 0;

    votes.forEach(vote => {
      if (vote.vote === 1) {
        upvoteCount++;
      } else if (vote.vote === -1) {
        downvoteCount++;
      }
    });

    return [upvoteCount, downvoteCount];
  }, [votes]);

  const currentUserDataQuery = useCurrentUserDataQuery();

  const currentUserVote = useMemo(() => {
    return votes.find(vote => vote.userId === currentUserDataQuery.data?.id)?.vote ?? 0;
  }, [votes, currentUserDataQuery.data?.id]);

  const upvoteMutation = useServerActionMutation({
    serverAction: upvoteCommentMutation,
    onSuccessfulAction: () => {
      updateOrAddVote({ userId: currentUserDataQuery.data!.id, vote: 1 });
    },
  });

  const downvoteMutation = useServerActionMutation({
    serverAction: downvoteCommentMutation,
    onSuccessfulAction: () => {
      updateOrAddVote({ userId: currentUserDataQuery.data!.id, vote: -1 });
    },
  });

  return (
    <>
      <Button
        size="sm"
        type="button"
        variant="outline"
        className={cn('flex items-center gap-2', currentUserVote === 1 && 'text-brand-500')}
        onClick={() => upvoteMutation.mutate(comment.id)}
      >
        <ArrowUpIcon size={16} />
        <span>{upvoteCount}</span>
      </Button>

      <Button
        size="sm"
        type="button"
        variant="outline"
        className={cn('flex items-center gap-2', currentUserVote === -1 && 'text-brand-500')}
        onClick={() => downvoteMutation.mutate(comment.id)}
      >
        <ArrowDownIcon size={16} />
        <span>{downvoteCount}</span>
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
