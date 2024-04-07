import { getTrailsQuery, type TrailSearchSchema } from '@/modules/trail/actions/get-trails-query';
import { TrailCard } from '@/modules/trail/components/trail-card';
import coatiSvg from '@/shared/assets/images/coati.svg';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { contentStatus } from '@/shared/constants/content-status';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';

type PageProps = {
  searchParams: Record<keyof TrailSearchSchema, string>;
};

export default async function Page({ searchParams }: PageProps) {
  const trails = await getTrailsQuery({
    search: searchParams.search,
    skip: Number(searchParams.skip ?? '0'),
    take: Number(searchParams.take ?? '30'),
    authorId: searchParams.authorId,
    category: searchParams.category,
    status: searchParams.status === 'all' ? undefined : searchParams.status,
  });

  return (
    <main className="container px-3 py-8">
      <form action="/dashboard/trails" method="get" className="mb-8 flex flex-col space-y-4">
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <Input type="text" name="category" placeholder="Buscar por categoria" />
          <Input type="text" name="search" placeholder="Buscar trilha" />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <RadioGroup className="flex gap-4" defaultValue="all" name="status">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">Todos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={contentStatus.DRAFT} id={contentStatus.DRAFT} />
              <Label htmlFor={contentStatus.DRAFT}>Rascunho</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={contentStatus.PUBLISHED} id={contentStatus.PUBLISHED} />
              <Label htmlFor={contentStatus.PUBLISHED}>Publicado</Label>
            </div>
          </RadioGroup>

          <Button type="submit" className="w-full items-center gap-2 md:w-fit">
            Buscar
            <SearchIcon className="rotate-90" size={20} />
          </Button>
        </div>
      </form>

      {trails.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 space-y-2">
          <h2 className="text-xl">Nenhuma trilha encontrada</h2>
          <Image src={coatiSvg} alt="Coati" width={200} height={200} className="opacity-30" />
          <p className="text-muted-foreground">Tente buscar por outra trilha</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {trails.map(trail => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </main>
  );
}
