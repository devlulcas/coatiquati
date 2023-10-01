import { protectWithRedirect } from '@/modules/auth/utils/protect-with-redirect';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  await protectWithRedirect({
    redirectTo: '/sign-in',
    acceptRoles: ['ADMIN', 'HIGH_PRIVILEGE_ADMIN'],
  });

  return <div className="py-8 container">{children}</div>;
}
