import { cn } from '@/shared/utils/cn';
import { type ClassValue } from 'clsx';
import { getRoleVisualIdentifier } from '../../lib/get-role-visual-identifier';

type UserRoleBadgeProps = {
  role: string;
  className?: ClassValue;
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const roleVisualIdentifier = getRoleVisualIdentifier(role);

  return (
    <span
      className={cn(
        'flex gap-1 items-center justify-center rounded-md text-sm font-medium',
        'text-' + roleVisualIdentifier.color,
      )}
    >
      {roleVisualIdentifier.label}
      {roleVisualIdentifier.icon}
    </span>
  );
}
