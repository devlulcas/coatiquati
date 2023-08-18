import { NewTrailDialogTrigger } from '@/modules/topic/components/new-topic-dialog-trigger';
import { TopicsTable } from '@/modules/topic/components/topics-table';
import { getTrailUseCase } from '@/modules/trail/use-cases/get-trail-use-case';
import Image from 'next/image';
import { redirect } from 'next/navigation';

type PageProps = {
  params: {
    trail: string;
  };
};

export default async function Page({ params }: PageProps) {
  const trailId = Number(params.trail);

  const trailData = await getTrailUseCase({ id: trailId });

  if (!trailData) redirect('/dashboard');

  return (
    <div className="flex flex-col gap-8">
      <div className="relative w-full h-96 rounded-lg shadow-lg overflow-clip border-2">
        <Image
          src={trailData.trail.thumbnail}
          alt={trailData.trail.title}
          fill
          fetchPriority="high"
          className="object-cover"
        />

        <div className="z-10 absolute p-5 w-full h-full bg-background/50 hover:backdrop-blur-md transition-all duration-300">
          <h1 className="text-2xl mb-4 font-bold truncate">
            {trailData.trail.title}
          </h1>
          <p className="text-lg truncate">{trailData.trail.description}</p>
        </div>
      </div>
      <section>
        <div className="flex justify-between mb-4">
          <h2 className="text-xl">Tópicos da trilha</h2>
          <NewTrailDialogTrigger trailId={trailId} />
        </div>

        <TopicsTable data={trailData.topics} />
      </section>
    </div>
  );
}
