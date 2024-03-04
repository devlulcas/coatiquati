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
      <aside className="w-full border-r bg-background/75 px-4 py-8 backdrop-blur-md lg:h-[--view-height] lg:w-72">
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

          <a href="/dashboard/feedback" className="w-full p-4 text-white">
            Feedback
          </a>
        </nav>
      </aside>

      <main className="h-[--view-height] flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
