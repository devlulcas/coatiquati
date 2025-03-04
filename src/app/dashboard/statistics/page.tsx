import { protectWithRedirect } from '@/modules/auth/utils/protect-with-redirect';
import { UsersPieData } from '@/modules/statistics/components/users-pie-data';

export default async function StatisticsPage() {
  await protectWithRedirect({
    redirectTo: '/sign-in',
    acceptRoles: ['ADMIN', 'HIGH_PRIVILEGE_ADMIN'],
  });

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl">Estatísticas</h2>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <UsersPieData
            data={[
              { permission: 'ADMIN', count: 10, fill: 'hsl(var(--brand-200))' },
              { permission: 'USER', count: 20, fill: 'hsl(var(--brand-100))' },
              { permission: 'HIGH_PRIVILEGE_ADMIN', count: 30, fill: 'hsl(var(--brand-500))' },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
