'use client';

import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { AddNewCommentForm } from '@/modules/comments/components/add-new-comment-form';
import { CommentBlock } from '@/modules/comments/components/comment-block';
import { useCommentsQuery } from '@/modules/comments/hooks/use-comments-query';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { Contributor } from '@/modules/user/types/user';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';

type RenderedContentWrapperProps = {
  children: React.ReactNode;
  title: string;
  by: Contributor;
  content: {
    id: number;
    type: string;
  };
};

export function RenderedContentWrapper({ children, title, by, content }: RenderedContentWrapperProps) {
  const currentUserDataQuery = useCurrentUserDataQuery();

  const isContentOwner = currentUserDataQuery.isSuccess && currentUserDataQuery.data.id === by.id;
  const isAdmin = currentUserDataQuery.isSuccess && isAdminOrAbove(currentUserDataQuery.data.role);

  const commentsQuery = useCommentsQuery(content.id, null);

  return (
    <section className="flex flex-col gap-2 border rounded bg-background/50">
      <header className="flex gap-2 p-2 border-b">
        <UserAvatar className="border border-secondary-foreground/25 rounded text-xs w-8 h-8" user={by} />

        <div className="flex flex-col justify-between">
          <h5 className="text-lg font-bold">{title}</h5>

          <Link className="text-sm text-muted-foreground" href={createProfileUrl(by.username)}>
            por <span className="text-brand-500">{by.username}</span>
            {isContentOwner && '(você)'}
            <span className="sr-only">Ver perfil de {by.username}</span>
          </Link>
        </div>

        {(isContentOwner || isAdmin) && (
          <Button className="ml-auto" variant="outline" size="icon" asChild>
            <Link href={`/contents/${content.id}/edit/${content.type}`} title="Você pode editar esse conteúdo">
              <PencilIcon size={16} />
              <span className="sr-only">Editar</span>
            </Link>
          </Button>
        )}
      </header>

      <div className="p-2 flex flex-col gap-3 relative">{children}</div>

      <footer className="p-2">
        <Separator className="my-4" />

        <AddNewCommentForm contentId={content.id} parentCommentId={null} />

        <Separator className="my-4" />

        <ul className="flex flex-col gap-2">
          {commentsQuery.isSuccess &&
            commentsQuery.data.map(comment => (
              <CommentBlock key={comment.id} comment={comment} by={by} content={content} />
            ))}
        </ul>
      </footer>
    </section>
  );
}
