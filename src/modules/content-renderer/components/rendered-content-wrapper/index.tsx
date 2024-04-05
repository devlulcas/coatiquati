import { getCommentsOnContentQuery } from '@/modules/comments/actions/get-comments-on-content-query';
import { AddNewCommentForm } from '@/modules/comments/components/add-new-comment-form';
import { CommentBlock } from '@/modules/comments/components/comment-block';
import type { Contributor } from '@/modules/user/types/user';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Separator } from '@/shared/components/ui/separator';
import { ContentAuthorProfileLink } from './content-author-profile-link';
import { EditContentButton } from './edit-content-button';

type RenderedContentWrapperProps = {
  children: React.ReactNode;
  title: string;
  by: Contributor;
  content: {
    id: number;
    type: string;
  };
};

export async function RenderedContentWrapper({ children, title, by, content }: RenderedContentWrapperProps) {
  const comments = await getCommentsOnContentQuery(content.id);

  return (
    <section className="flex flex-col gap-2 rounded border bg-background/50">
      <header className="flex gap-2 border-b p-2">
        <UserAvatar className="h-8 w-8 rounded border border-secondary-foreground/25 text-xs" user={by} />

        <div className="flex flex-col justify-between">
          <h5 className="text-lg font-bold">{title}</h5>
          <ContentAuthorProfileLink by={by} />
        </div>

        <EditContentButton by={by} content={content} />
      </header>

      <div className="relative flex flex-col gap-3 p-2">{children}</div>

      <footer className="p-2">
        <Separator className="my-4" />

        <AddNewCommentForm contentId={content.id} parentCommentId={null} />

        <Separator className="my-4" />

        <ul className="flex flex-col gap-2">
          {comments.map(comment => (
            <CommentBlock key={comment.id} comment={comment} />
          ))}
        </ul>
      </footer>
    </section>
  );
}
