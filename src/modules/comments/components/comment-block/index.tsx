'use client';

import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { Contributor } from '@/modules/user/types/user';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { memo, useState } from 'react';
import { useCommentsQuery } from '../../hooks/use-comments-query';
import type { CommentWithAuthor } from '../../types/comment';
import { AnswerCommentDrawerTrigger } from '../answer-comment-drawer-trigger';
import { CommentVoteBlock } from '../comment-vote-block';

type CommentBlockProps = {
  comment: CommentWithAuthor;
  by: Contributor;
  content: {
    id: number;
  };
};

function InnerCommentBlock({ comment, by, content }: CommentBlockProps) {
  const [openResponses, setOpenResponses] = useState(false);

  const responseCommentsQuery = useCommentsQuery(content.id, comment.id, {
    enabled: Boolean(comment.id) && openResponses,
  });

  return (
    <li key={comment.id} id={'#' + comment.id} className="mt-2">
      <div className="border rounded bg-secondary/50">
        <div className="flex p-1 bg-secondary backdrop-blur-sm gap-2 items-center w-full flex-row">
          <UserAvatar className="border border-secondary-foreground/25 rounded text-xs w-8 h-8" user={comment.author} />

          <Link href={createProfileUrl(comment.author.username)} className="text-sm flex items-center gap-1 mr-auto">
            <span className="text-brand-500 truncate max-w-[20ch] md:max-w-xs"> {comment.author.username} </span>

            {comment.author.id === by.id && (
              <span className="px-[4px] py-[2px] text-xs text-primary bg-primary-foreground rounded leading-none">
                autor
              </span>
            )}
          </Link>
        </div>

        <p className="p-2">{comment.content}</p>

        <div className="p-2">
          <div className="flex items-center gap-2 w-fit ml-auto">
            <AnswerCommentDrawerTrigger originalComment={{ ...comment, contentId: content.id }} />

            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenResponses(!openResponses)}
              disabled={responseCommentsQuery.fetchStatus === 'fetching'}
              className="flex items-center gap-2"
            >
              {openResponses ? (
                <>
                  <span className="sr-only lg:not-sr-only">Ocultar</span>
                  <EyeOffIcon className="lg:hidden" size={16} />
                </>
              ) : (
                <>
                  <span className="sr-only lg:not-sr-only">Ver</span>
                  <EyeIcon className="lg:hidden" size={16} />
                </>
              )}{' '}
              respostas
            </Button>

            <CommentVoteBlock voteCount={comment.upvotes - comment.downvotes} commentId={comment.id} />
          </div>
        </div>
      </div>

      {openResponses && (
        <div className="pl-2 border-l border-primary/10">
          {responseCommentsQuery.fetchStatus === 'fetching' && (
            <p className="text-sm text-center p-4">Carregando respostas...</p>
          )}

          {responseCommentsQuery.isError && <p className="text-sm text-center p-4">Erro ao carregar respostas</p>}

          {responseCommentsQuery.isSuccess && responseCommentsQuery.data.length === 0 && (
            <p className="text-sm text-center p-4">Nenhuma resposta ainda</p>
          )}

          {responseCommentsQuery.isSuccess && (
            <ul>
              {responseCommentsQuery.data.map(comment => (
                <CommentBlock key={comment.id} comment={comment} by={by} content={content} />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

function areEqual(prevProps: CommentBlockProps, nextProps: CommentBlockProps) {
  return prevProps.comment.id === nextProps.comment.id;
}

export const CommentBlock = memo(InnerCommentBlock, areEqual);
