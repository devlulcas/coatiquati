import { ClockIcon } from 'lucide-react';

type UpdatedAtProps = {
  updatedAt: Date;
};

export function UpdatedAt({ updatedAt }: UpdatedAtProps) {
  return (
    <time dateTime={updatedAt.toISOString()} className="flex items-center gap-2 text-sm">
      <ClockIcon className="h-4 w-4 text-muted-foreground" />
      <span>Atualizado em</span>
      {new Date(updatedAt).toLocaleString()}
    </time>
  );
}
