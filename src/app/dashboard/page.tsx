import { TrailsTable } from '@/modules/trail/components/trails-table';
import { getTrailsUseCase } from '@/modules/trail/use-cases/get-trails-use-case';
import { UsersTable } from '@/modules/user/components/users-table';
import { getUsersUseCase } from '@/modules/user/use-cases/get-users-use-case';
import { Button } from '@/shared/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  const trailsData = await getTrailsUseCase();
  const users = await getUsersUseCase();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Trilhas</h2>

          <Button variant="link" asChild>
            <Link href="/dashboard/trails/new">
              Criar nova trilha
              <PlusIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <TrailsTable data={trailsData.map((data) => data.trail)} />
      </section>

      <section>
        <h2 className="text-xl mb-4">Usuários</h2>
        <UsersTable data={users} />
      </section>
    </div>
  );
}
