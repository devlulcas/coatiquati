import { roles } from '@/modules/auth/constants/roles';
import { cn } from '@/shared/utils/cn';
import { RatIcon, SquirrelIcon } from 'lucide-react';

type UserRoleBadgeProps = {
  role: string;
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const isAdmin = role === roles.ADMIN;

  return (
    <span
      className={cn(
        'flex gap-1 items-center justify-center',
        isAdmin ? 'text-purple-500' : 'text-pink-400'
      )}
    >
      {isAdmin ? <SquirrelIcon size={18} /> : <RatIcon size={18} />}
      {isAdmin ? 'Administrador' : 'Usuário'}
    </span>
  );
}
