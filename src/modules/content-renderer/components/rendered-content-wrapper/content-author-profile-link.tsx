'use client';
import Link from 'next/link';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { Contributor } from '@/modules/user/types/user';

type RenderedContentWrapperProps = {
  by: Contributor;
};

export function ContentAuthorProfileLink({ by }: RenderedContentWrapperProps) {
  const currentUserDataQuery = useCurrentUserDataQuery();
  const isContentAuthor = currentUserDataQuery.isSuccess && currentUserDataQuery.data.id === by.id;

  return (
    <Link className="text-sm text-muted-foreground" href={createProfileUrl(by.username)}>
      por <span className="text-brand-500">{by.username}</span>
      {isContentAuthor && '(você)'}
      <span className="sr-only">Ver perfil de {by.username}</span>
    </Link>
  );
}
