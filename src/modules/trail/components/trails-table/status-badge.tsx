import { cn } from '@/shared/utils/cn';
import { Trail } from '../../types/trail';

type StatusBadgeProps = {
  status: Trail['status'];
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const isPublished = status === 'published';

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium',
        isPublished
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      )}
    >
      {isPublished ? 'Publicado' : 'Rascunho'}
    </span>
  );
}
