import { roles } from '@/modules/auth/constants/roles';
import { RatIcon, SquirrelIcon } from 'lucide-react';

type RoleVisualIdentifier = {
  label: string;
  icon: React.ReactNode;
  color: string;
};

export function getRoleVisualIdentifier(role: string): RoleVisualIdentifier {
  switch (role) {
    case roles.HIGH_PRIVILEGE_ADMIN:
      return {
        label: 'Administrador de alto privilégio',
        icon: <SquirrelIcon size={16} />,
        color: 'yellow-500',
      };
    case roles.ADMIN:
      return {
        label: 'Administrador',
        icon: <SquirrelIcon size={16} />,
        color: 'purple-500',
      };
    default:
      return {
        label: 'Usuário',
        icon: <RatIcon size={16} />,
        color: 'pink-500',
      };
  }
}
