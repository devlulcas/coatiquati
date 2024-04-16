import { getTrailsQuery } from '@/modules/trail/actions/get-trails-query';
import { TrailCard } from '@/modules/trail/components/trail-card';
import { groupTrailsByCategory } from '@/modules/trail/lib/group-trails-by-category';
import coatiSvg from '@/shared/assets/images/coati.svg';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';

type PageProps = {
  searchParams: {
    search?: string;
    skip?: string;
    take?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const trailsResult = await getTrailsQuery({
    search: searchParams.search,
    skip: Number(searchParams.skip ?? '0'),
    take: Number(searchParams.take ?? '30'),
  });

  if (trailsResult.type === 'fail') {
    return <ErrorMessage message={trailsResult.fail} className="container my-8" />;
  }

  const trailsGroupedByCategory = groupTrailsByCategory(trailsResult.value);

  return (
    <main className="container py-8">
      <form action="/trails" method="get" className="mb-8 flex items-center justify-center space-x-2">
        <Input type="text" name="search" placeholder="Buscar trilha" />
        <Button type="submit" className="items-center gap-2">
          Buscar
          <SearchIcon className="rotate-90" size={20} />
        </Button>
      </form>

      {trailsResult.value.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 space-y-2">
          <h2 className="text-xl">Nenhuma trilha encontrada</h2>
          <Image src={coatiSvg} alt="Coati" width={200} height={200} className="opacity-30" />
          <p className="text-muted-foreground">Tente buscar por outra trilha</p>
        </div>
      )}

      {trailsGroupedByCategory.map(([category, trails]) => (
        <section className="mb-8" key={category}>
          <h2 className="text-2xl font-bold">{category}</h2>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
            {trailsResult.value.map(trail => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
