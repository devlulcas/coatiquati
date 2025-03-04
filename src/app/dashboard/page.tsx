import { getTrailsQuery } from '@/modules/trail/actions/get-trails-query';
import { TrailsTable } from '@/modules/trail/components/trails-table';
import { getUsersQuery } from '@/modules/user/actions/get-users-query';
import { UsersTable } from '@/modules/user/components/users-table';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { isFail } from '@/shared/lib/result';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams: Promise<{
    search?: string;
    skip?: string;
    take?: string;
  }>;
};

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const trailsResult = await getTrailsQuery({
    search: searchParams.search,
    skip: Number(searchParams.skip ?? '0'),
    take: Number(searchParams.take ?? '60'),
  });

  const usersResult = await getUsersQuery();

  return (
    <div className="flex flex-col gap-8">
      <section>
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl">Trilhas</h2>

          <Button variant="link" asChild>
            <Link href="/dashboard/trails/new">
              Criar nova trilha
              <PlusIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {isFail(trailsResult) ? (
          <ErrorMessage message={trailsResult.fail} className="mt-4" />
        ) : (
          <TrailsTable data={trailsResult.value} />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl">Usuários</h2>
        {isFail(usersResult) ? <ErrorMessage message={usersResult.fail} className="mt-4" /> : <UsersTable />}
      </section>
    </div>
  );
}
