import { protectWithRedirect } from '@/modules/auth/utils/protect-with-redirect';

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
      <aside className="lg:h-[--view-height] w-full lg:w-72 border-r bg-background/75 px-4 py-8 backdrop-blur-md">
        <nav className="flex flex-col items-center divide-y">
          <a href="/dashboard" className="w-full p-4 text-white">
            Dashboard
          </a>
          <a href="/dashboard/trails" className="w-full p-4 text-white">
            Trilhas
          </a>
          <a href="/dashboard/categories" className="w-full p-4 text-white">
            Categorias
          </a>
          <a href="/dashboard/bans" className="w-full p-4 text-white">
            Banimentos
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8 h-[--view-height] overflow-y-auto">{children}</main>
    </div>
  );
}
