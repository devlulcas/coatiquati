import { protectWithRedirect } from '@/modules/auth/utils/protect-with-redirect';
import Link from 'next/link';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  await protectWithRedirect({
    redirectTo: '/sign-in',
    acceptRoles: ['ADMIN', 'HIGH_PRIVILEGE_ADMIN'],
  });

  return (
    <div className="flex h-[--view-height] flex-col lg:flex-row">
      <aside className="w-full border-r bg-background/75 px-4 py-8 backdrop-blur-md lg:h-[--view-height] lg:w-72">
        <nav className="flex flex-col items-center divide-y">
          <Link href="/dashboard" className="w-full p-4 text-foreground hover:text-brand-400">
            Dashboard
          </Link>
          <Link href="/dashboard/trails" className="w-full p-4 text-foreground hover:text-brand-400">
            Trilhas
          </Link>
          <Link href="/dashboard/bans" className="w-full p-4 text-foreground hover:text-brand-400">
            Banimentos
          </Link>
          <Link href="/dashboard/feedback" className="w-full p-4 text-foreground hover:text-brand-400">
            Feedback
          </Link>
          <Link href="/dashboard/statistics" className="w-full p-4 text-foreground hover:text-brand-400">
            Estatísticas
          </Link>
        </nav>
      </aside>

      <main className="h-[--view-height] flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
