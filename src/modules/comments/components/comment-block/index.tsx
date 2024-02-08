import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { Contributor } from '@/modules/user/types/user';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import Link from 'next/link';
import type { CommentWithAuthor } from '../../types/comment';
import { getCommentsOnContentUseCase } from '../../use-cases/get-comments-on-content-use-case';
import { AnswerCommentDrawerTrigger } from '../answer-comment-drawer-trigger';
import { CommentVoteBlock } from '../comment-vote-block';

type CommentBlockProps = {
  comment: CommentWithAuthor;
  by: Contributor;
  content: {
    id: number;
  };
};

export async function CommentBlock({ comment, by, content }: CommentBlockProps) {
  const session = await getPageSession();

  const responses = comment.parentCommentId ? getCommentsOnContentUseCase.execute(content.id, session) : null;

  return (
    <li key={comment.id} id={'#' + comment.id} className="mt-2">
      <div className="rounded border bg-secondary/50">
        <div className="flex w-full flex-row items-center gap-2 bg-secondary p-1 backdrop-blur-sm">
          <UserAvatar className="h-8 w-8 rounded border border-secondary-foreground/25 text-xs" user={comment.author} />

          <Link href={createProfileUrl(comment.author.username)} className="mr-auto flex items-center gap-1 text-sm">
            <span className="max-w-[20ch] truncate text-brand-500 md:max-w-xs"> {comment.author.username} </span>

            {comment.author.id === by.id && (
              <span className="rounded bg-primary-foreground px-[4px] py-[2px] text-xs leading-none text-primary">
                autor
              </span>
            )}
          </Link>
        </div>

        <p className="p-2">{comment.content}</p>

        <div className="p-2">
          <div className="ml-auto flex w-fit items-center gap-2">
            <AnswerCommentDrawerTrigger originalComment={{ ...comment, contentId: content.id }} />

            <CommentVoteBlock
              contentId={content.id}
              voteCount={comment.upvotes - comment.downvotes}
              commentId={comment.id}
            />
          </div>
        </div>
      </div>

      {responses && responses.length > 0 && (
        <div className="border-l border-primary/10 pl-2">
          <ul>
            {responses.map(response => (
              <CommentBlock key={comment.id} comment={response} by={by} content={content} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
