import { getTrailsQuery, type TrailSearchSchema } from '@/modules/trail/actions/get-trails-query';
import { TrailCard } from '@/modules/trail/components/trail-card';
import coatiSvg from '@/shared/assets/images/coati.svg';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { isFail } from '@/shared/lib/result';
import Image from 'next/image';

export async function DashboardTrailResultView({ searchParams }: { searchParams: Record<keyof TrailSearchSchema, string> }) {
  const trailsResult = await getTrailsQuery({
    search: searchParams.search,
    skip: Number(searchParams.skip ?? '0'),
    take: Number(searchParams.take ?? '30'),
    authorId: searchParams.authorId,
    category: searchParams.category,
    status: searchParams.status === 'all' ? undefined : searchParams.status,
  });

  if (isFail(trailsResult)) {
    return <ErrorMessage message={trailsResult.fail} className="container my-8" />;
  }

  return (
    <>
      {trailsResult.value.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 space-y-2">
          <h2 className="text-xl">Nenhuma trilha encontrada</h2>
          <Image src={coatiSvg} alt="Coati" width={200} height={200} className="opacity-30" />
          <p className="text-muted-foreground">Tente buscar por outra trilha</p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {trailsResult.value.map(trail => (
          <TrailCard key={trail.id} trail={trail} />
        ))}
      </div>
    </>
  )
}
