import { getCommentsOnContentQuery } from '@/modules/comments/actions/get-comments-on-content-query';
import { AddNewCommentForm } from '@/modules/comments/components/add-new-comment-form';
import { CommentBlock } from '@/modules/comments/components/comment-block';
import type { ContentType } from '@/modules/database/schema/content';
import { ReportFormDialogTrigger } from '@/modules/user-moderation/components/report-form-dialog-trigger';
import type { Contributor } from '@/modules/user/types/user';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Separator } from '@/shared/components/ui/separator';
import { isFail } from '@/shared/lib/result';
import { EllipsisIcon } from 'lucide-react';
import { ContentAuthorProfileLink } from './content-author-profile-link';
import { EditContentButton } from './edit-content-button';

type RenderedContentWrapperProps = {
  children: React.ReactNode;
  title: string;
  by: Contributor;
  content: {
    id: number;
    type: ContentType;
  };
};

export async function RenderedContentWrapper({
  children,
  title,
  by,
  content,
}: RenderedContentWrapperProps) {
  const commentsResult = await getCommentsOnContentQuery({
    contentId: content.id,
  });

  if (isFail(commentsResult)) {
    return <ErrorMessage message={commentsResult.fail} />;
  }

  return (
    <section className="flex flex-col gap-2 rounded border bg-background/50">
      <header className="flex gap-2 border-b p-2">
        <UserAvatar
          className="h-8 w-8 rounded border border-secondary-foreground/25 text-xs"
          user={by}
        />

        <div className="flex w-full flex-col justify-between">
          <h5 className="text-lg font-bold">{title}</h5>
          <div className="relative flex w-full items-center justify-between">
            <ContentAuthorProfileLink by={by} />

            <ReportFormDialogTrigger
              params={{
                contentId: content.id,
                userId: by.id,
              }}
            >
              <div className="relative ml-auto flex h-[1ch] w-[2.5ch] items-center justify-center">
                <button
                  type="button"
                  aria-label="Mais opções"
                  title="Mais opções"
                  className="absolute flex h-10 w-10 items-center justify-center rounded-full text-sm text-brand-50 hover:bg-brand-800/50 focus:bg-brand-800/50"
                >
                  <EllipsisIcon size={16} />
                </button>
              </div>
            </ReportFormDialogTrigger>
          </div>
        </div>

        <EditContentButton
          by={by}
          content={{ id: content.id, type: content.type }}
        />
      </header>

      <div className="relative flex flex-col gap-3 p-2">{children}</div>

      <footer className="p-2">
        <Separator className="my-4" />

        <AddNewCommentForm contentId={content.id} parentCommentId={null} />

        <Separator className="my-4" />

        <ul className="flex flex-col gap-2">
          {commentsResult.value.map((comment) => (
            <CommentBlock key={comment.id} comment={comment} />
          ))}
        </ul>
      </footer>
    </section>
  );
}
