'use client';
import type { User } from '@/modules/auth/lib/auth-client';
import { cn } from '@/shared/utils/cn';
import type { Icon } from '@phosphor-icons/react';
import { BookIcon } from '@phosphor-icons/react/Book';
import { HouseIcon } from '@phosphor-icons/react/House';
import { SignInIcon } from '@phosphor-icons/react/SignIn';
import { UserIcon } from '@phosphor-icons/react/User';
import { WrenchIcon } from '@phosphor-icons/react/Wrench';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import css from './header-nav.module.css';

type HeaderNavProps = {
  user: User | null;
};

type NavItem = {
  icon: Icon;
  label: string;
  href: string;
};

const baseNavItems: NavItem[] = [
  {
    icon: HouseIcon,
    label: 'Trilhas',
    href: '/trails',
  },
  {
    icon: BookIcon,
    label: 'Sobre',
    href: '/about',
  },
  {
    icon: WrenchIcon,
    label: 'Ferramentas',
    href: '/tools',
  },
];

const adminNavItems: NavItem[] = [
  {
    icon: HouseIcon,
    label: 'Dashboard',
    href: '/dashboard',
  },
];

const userNavItems: NavItem[] = [
  {
    icon: UserIcon,
    label: 'Perfil',
    href: '/profile',
  },
];

const guestNavItems: NavItem[] = [
  {
    icon: SignInIcon,
    label: 'Entrar',
    href: '/sign-in',
  },
];

function getNavItems(user: User | null) {
  if (!user) return [...baseNavItems, ...guestNavItems];

  if (user.role === 'admin' || user.role === 'superAdmin') return [...baseNavItems, ...adminNavItems, ...userNavItems];

  return [...baseNavItems, ...userNavItems];
}

export function HeaderNav({ user }: HeaderNavProps) {
  const navItems = getNavItems(user);

  const currentPath = usePathname();

  return (
    <nav className="flex items-center justify-center gap-3 md:gap-4">
      {navItems.map(item => {
        const isActive = currentPath === item.href;
        const Icon = item.icon;
        return (
          <Link
            data-active={isActive}
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-1 md:gap-2 md:h-10 md:aspect-square justify-center group',
              css.navItem,
            )}
          >
            <span className="text-xs md:text-sm font-medium transition-colors">{item.label}</span>
            <Icon weight="duotone" size={18} className="flex-shrink-0 hidden md:inline-flex" />
          </Link>
        );
      })}
    </nav>
  );
}
