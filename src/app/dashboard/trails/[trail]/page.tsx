import { NewTrailDialogTrigger } from '@/modules/topic/components/new-topic-dialog-trigger';
import { TopicsTable } from '@/modules/topic/components/topics-table';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import { getTrailUseCase } from '@/modules/trail/use-cases/get-trail-use-case';
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
      <TrailHeading
        trail={trailData.trail}
        author={trailData.author}
        className="mb-8"
      />

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
