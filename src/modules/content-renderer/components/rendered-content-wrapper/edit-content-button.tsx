'use client';
import type { ContentType } from '@/modules/database/lib/content-enum';
import { useCurrentUserDataQuery } from '@/modules/user/hooks/use-user-data-query';
import type { Contributor } from '@/modules/user/types/user';
import { Button } from '@/shared/components/ui/button';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';

type RenderedContentWrapperProps = {
  by: Contributor;
  content: {
    id: number;
    type: ContentType;
  };
};

export function EditContentButton({ by, content }: RenderedContentWrapperProps) {
  const currentUserDataQuery = useCurrentUserDataQuery();
  const isContentAuthor = currentUserDataQuery.isSuccess && currentUserDataQuery.data.id === by.id;

  if (!isContentAuthor) {
    return null;
  }

  return (
    <Button className="ml-auto" variant="outline" size="icon" asChild>
      <Link href={`/contents/${content.id}/edit/${content.type}`} title="Você pode editar esse conteúdo">
        <PencilIcon size={16} />
        <span className="sr-only">Editar</span>
      </Link>
    </Button>
  );
}
