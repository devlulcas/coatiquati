import { ClockIcon } from 'lucide-react';

type UpdatedAtProps = {
  updatedAt: string;
};

export function UpdatedAt({ updatedAt }: UpdatedAtProps) {
  return (
    <time dateTime={updatedAt} className="flex items-center gap-2 text-sm">
      <ClockIcon className="w-4 h-4 text-muted-foreground" />
      <span>Atualizado em</span>
      {new Date(updatedAt).toLocaleString()}
    </time>
  );
}
