import { roles } from '@/modules/auth/constants/roles';
import { cn } from '@/shared/utils/cn';
import { type ClassValue } from 'clsx';
import { RatIcon, SquirrelIcon } from 'lucide-react';

type UserRoleBadgeProps = {
  role: string;
  className?: ClassValue | ((isAdmin: boolean) => ClassValue);
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const isAdmin = role === roles.ADMIN;

  return (
    <span
      className={cn(
        'flex gap-1 items-center justify-center rounded-md text-sm font-medium',
        isAdmin ? 'text-purple-500' : 'text-pink-500',
        typeof className === 'function' ? className(isAdmin) : className
      )}
    >
      {isAdmin ? 'Administrador' : 'Usuário'}
      {isAdmin ? <SquirrelIcon size={16} /> : <RatIcon size={16} />}
    </span>
  );
}
