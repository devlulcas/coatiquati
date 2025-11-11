'use client';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import type { Contributor } from '@/modules/user/types/user';
import Link from 'next/link';

type RenderedContentWrapperProps = {
  by: Contributor;
};

export function ContentAuthorProfileLink({ by }: RenderedContentWrapperProps) {
  const currentUserDataQuery = useCurrentUserDataQuery();
  const isContentAuthor =
    currentUserDataQuery.isSuccess && currentUserDataQuery.data.id === by.id;

  return (
    <Link
      className="text-sm text-muted-foreground"
      href={`/profile/${by.username}`}
    >
      por <span className="text-brand-500">{by.name}</span>
      {isContentAuthor && '(você)'}
      <span className="sr-only">Ver perfil de {by.name}</span>
    </Link>
  );
}
