'use client';

import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { Contributor } from '@/modules/user/types/user';
import { Button } from '@/shared/components/ui/button';
import { PencilIcon } from 'lucide-react';
import Image from 'next/image';
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

  return (
    <section className="flex flex-col gap-2 border rounded bg-background/50">
      <header className="flex gap-2 p-2 border-b">
        <Image
          className="rounded w-14 h-14"
          alt={by.username}
          src={by.avatar ?? '/user-avatar.png'}
          width={48}
          height={48}
        />
        <div className="flex flex-col justify-between">
          <h5 className="text-lg font-bold">{title}</h5>
          <Link className="text-md text-muted-foreground" href={createProfileUrl(by.username)}>
            por{' '}
            <span className="text-brand-500">
              {by.username} {isContentOwner && '(você)'}
            </span>
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

      <div className="p-2 flex flex-col gap-3">{children}</div>
    </section>
  );
}
