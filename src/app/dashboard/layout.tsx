import { protectWithRedirect } from '@/modules/auth/utils/protect-with-redirect';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await protectWithRedirect({
    redirectTo: '/sign-in',
    acceptRoles: ['ADMIN'],
  });

  return <div className="py-4">{children}</div>;
}
