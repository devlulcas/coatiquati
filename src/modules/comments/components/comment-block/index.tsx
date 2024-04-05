'use client';

import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import type { Comment } from '../../types/comment';
import { AnswerCommentDrawerTrigger } from '../answer-comment-drawer-trigger';

type CommentBlockProps = {
  comment: Comment;
};

export function CommentBlock({ comment }: CommentBlockProps) {
  const [open, setOpen] = useState(false);

  const query = useCommentResponsesQuery(comment.contentId, comment.id, open);

  return (
    <li className="flex flex-col gap-4 rounded border bg-gradient-to-br from-background/75 to-background/50 px-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 py-4">
        <UserAvatar className="h-8 w-8 rounded border border-secondary-foreground/25 text-xs" user={comment.author} />
        <p className="text-md font-bold">{comment.author.username}</p>
      </div>

      <div className="flex flex-col justify-between">
        <p className="text-sm text-muted-foreground">{comment.content}</p>
        <div className="flex items-center justify-end gap-2">
          <AnswerCommentDrawerTrigger originalComment={comment} />
          <Button size="sm" variant="outline" className="items-center gap-2" onClick={() => setOpen(!open)}>
            Buscar respostas
          </Button>
        </div>
      </div>

      {query.isLoading && (
        <p className="flex h-12 items-center justify-center text-muted-foreground">
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

      {query.isSuccess && (
        <ul className="flex flex-col gap-2 border-l border-border/25 pl-2">
          {query.data.map(response => (
            <CommentBlock key={response.id} comment={response} />
          ))}
        </ul>
      )}
    </li>
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
