import { BoltIcon, HammerIcon, UserIcon } from 'lucide-react';

type RoleVisualIdentifier = {
  label: string;
  icon: React.ReactNode;
};

export function getRoleVisualIdentifier(role: string): RoleVisualIdentifier {
  switch (role) {
    case 'highPrivilegeAdmin':
      return {
        label: 'Administrador de alto privilégio',
        icon: <HammerIcon size={16} />,
      };
    case 'admin':
      return {
        label: 'Administrador',
        icon: <BoltIcon size={16} />,
      };
    default:
      return {
        label: 'Usuário',
        icon: <UserIcon size={16} />,
      };
  }
}
