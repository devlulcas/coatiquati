import { ContentStatus } from '@/modules/database/schema/content';
import { cn } from '@/shared/utils/cn';
import { cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const contentStatus = {
  [ContentStatus.DRAFT]: 'Rascunho',
  [ContentStatus.PUBLISHED]: 'Publicado',
  [ContentStatus.ARCHIVED]: 'Arquivado',
};

const variants = cva(
  'inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium',
  {
    variants: {
      status: {
        [ContentStatus.DRAFT]: 'bg-green-100 text-green-800',
        [ContentStatus.PUBLISHED]: 'bg-yellow-100 text-yellow-800',
        [ContentStatus.ARCHIVED]: 'bg-red-100 text-red-800',
      },
    },
    defaultVariants: {
      status: ContentStatus.DRAFT,
    },
  }
);

export function ContentStatusBadge({
  status,
  className,
}: {
  status: ContentStatus;
  className?: ClassValue;
}) {
  const badgeClassName = variants({ status });
  return (
    <span className={cn(badgeClassName, className)}>
      {contentStatus[status]}
    </span>
  );
}
