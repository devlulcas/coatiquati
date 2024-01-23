import { TrailCard } from '@/modules/trail/components/trail-card';
import { groupTrailsByCategory } from '@/modules/trail/lib/group-trails-by-category';
import { GetTrailsUseCase } from '@/modules/trail/use-cases/get-trails-use-case';
import coatiSvg from '@/shared/assets/images/coati.svg';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import Image from 'next/image';

type PageProps = {
  searchParams: {
    search?: string;
  };
};

export default async function Page(props: PageProps) {
  const getTrailsUseCase = new GetTrailsUseCase();
  const trails = await getTrailsUseCase.execute({ search: props.searchParams.search });
  const trailsGroupedByCategory = groupTrailsByCategory(trails);

  return (
    <main className="py-8 container">
      <form action="/trails" method="get" className="flex items-center justify-center space-x-2 mb-8">
        <Input type="text" name="search" placeholder="Buscar trilha" />
        <Button type="submit">Buscar</Button>
      </form>

      {trails.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-2 gap-4">
          <h2 className="text-xl">Nenhuma trilha encontrada</h2>
          <Image src={coatiSvg} alt="Coati" width={200} height={200} className="opacity-30" />
          <p className="text-muted-foreground">Tente buscar por outra trilha</p>
        </div>
      )}

      {trailsGroupedByCategory.map(([category, trails]) => (
        <section className="mb-8" key={category}>
          <h2 className="text-2xl font-bold">{category}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {trails.map(trail => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
