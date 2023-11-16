import { roles } from '@/modules/auth/constants/roles';
import { RatIcon, SquirrelIcon } from 'lucide-react';

type RoleVisualIdentifier = {
  label: string;
  icon: React.ReactNode;
};

export function getRoleVisualIdentifier(role: string): RoleVisualIdentifier {
  switch (role) {
    case roles.HIGH_PRIVILEGE_ADMIN:
      return {
        label: 'Administrador de alto privilégio',
        icon: <SquirrelIcon size={16} />,
      };
    case roles.ADMIN:
      return {
        label: 'Administrador',
        icon: <SquirrelIcon size={16} />,
      };
    default:
      return {
        label: 'Usuário',
        icon: <RatIcon size={16} />,
      };
  }
}
