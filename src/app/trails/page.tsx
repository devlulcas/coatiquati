import { TrailCard } from '@/modules/trail/components/trail-card';
import { getTrailsUseCase } from '@/modules/trail/use-cases/get-trails-use-case';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

type PageProps = {
  searchParams: {
    search?: string;
  };
};

export default async function Page(props: PageProps) {
  const trails = await getTrailsUseCase({
    search: props.searchParams.search,
  });

  return (
    <main className="py-8">
      <form
        action="/trails"
        method="get"
        className="flex items-center justify-center space-x-2 mb-8"
      >
        <Input type="text" name="search" placeholder="Buscar trilha" />
        <Button type="submit">Buscar</Button>
      </form>

      {trails.map((trail) => (
        <TrailCard key={trail.id} trail={trail} />
      ))}
    </main>
  );
}
