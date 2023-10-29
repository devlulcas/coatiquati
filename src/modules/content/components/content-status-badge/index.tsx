import { contentStatus, type ContentStatus } from '@/shared/constants/content-status';
import { cn } from '@/shared/utils/cn';

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  const isPublished = status === contentStatus.PUBLISHED;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium',
        isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
      )}
    >
      {isPublished ? 'Publicado' : 'Rascunho'}
    </span>
  );
}
