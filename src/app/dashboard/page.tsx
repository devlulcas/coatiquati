import { TrailCategoryForm } from '@/modules/category/components/trail-category-form';
import { getTrailsQuery } from '@/modules/trail/actions/get-trails-query';
import { TrailsTable } from '@/modules/trail/components/trails-table';
import { getUsersQuery } from '@/modules/user/actions/get-users-query';
import { UsersTable } from '@/modules/user/components/users-table';
import { Button } from '@/shared/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams: {
    search?: string;
    skip?: string;
    take?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const trailsData = await getTrailsQuery({
    search: searchParams.search,
    skip: Number(searchParams.skip ?? '0'),
    take: Number(searchParams.take ?? '60'),
  });

  const users = await getUsersQuery();

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
        <TrailsTable data={trailsData} />
      </section>

      <section>
        <h2 className="mb-4 text-xl">Categorias</h2>
        <TrailCategoryForm />
      </section>

      <section>
        <h2 className="mb-4 text-xl">Usuários</h2>
        <UsersTable data={users} />
      </section>
    </div>
  );
}
