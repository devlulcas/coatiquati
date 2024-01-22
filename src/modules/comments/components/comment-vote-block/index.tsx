'use client';

import { ArrowBigDownIcon, ArrowBigUpIcon } from 'lucide-react';
import { memo } from 'react';
import { useDownvoteCommentMutation } from '../../hooks/use-downvote-comment-mutation';
import { useUpvoteCommentMutation } from '../../hooks/use-upvote-comment-mutation';

type InnerCommentVoteBlockProps = {
  voteCount: number;
  contentId: number;
  commentId: number;
};

function InnerCommentVoteBlock({ voteCount, commentId, contentId }: InnerCommentVoteBlockProps) {
  const downvoteCommentMutation = useDownvoteCommentMutation(contentId, commentId);
  const upvoteCommentMutation = useUpvoteCommentMutation(contentId, commentId);

  return (
    <div className="border border-white/10 rounded flex gap-1 items-center h-8">
      <button
        onClick={() => upvoteCommentMutation.mutate()}
        className="w-8 h-full flex items-center justify-center group"
      >
        <span className="sr-only">Votar positivamente</span>
        <span className="text-secondary-foreground">
          <ArrowBigUpIcon
            className="fill-secondary-foreground group-hover:fill-brand-500 group-hover:stroke-brand-500"
            size={16}
          />
        </span>
      </button>

      <p className="text-secondary-foreground w-[3ch] text-center leading-none border-x border-white/10">{voteCount}</p>

      <button
        onClick={() => downvoteCommentMutation.mutate()}
        className="w-8 h-full flex items-center justify-center group"
      >
        <span className="sr-only">Votar negativamente</span>
        <span className="text-secondary-foreground">
          <ArrowBigDownIcon
            className="fill-secondary-foreground group-hover:fill-brand-500 group-hover:stroke-brand-500"
            size={16}
          />
        </span>
      </button>
    </div>
  );
}

export const CommentVoteBlock = memo(InnerCommentVoteBlock);