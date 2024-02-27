import { TopicCardItem } from '@/modules/topic/components/topic-card-item';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import { GetTrailUseCase } from '@/modules/trail/use-cases/get-trail-use-case';
import { redirect } from 'next/navigation';

type PageProps = {
  params: {
    trail: string;
  };
};

export default async function Page({ params }: PageProps) {
  const trailId = Number(params.trail);

  const getTrailUseCase = new GetTrailUseCase();
  const trailData = await getTrailUseCase.execute({ id: trailId });

  if (!trailData) redirect('/');

  return (
    <div className="container py-8">
      <TrailHeading trail={trailData} className="mb-8" />

      {trailData.topics.length === 0 && <p className="text-center text-lg">Nenhum tópico encontrado</p>}

      <h2 className="mb-4 text-2xl font-bold">{trailData.topics.length} tópicos</h2>

      <ul className="flex flex-col gap-4 border-l-2 border-gray-300 pl-4">
        {trailData.topics.map(topic => (
          <li key={topic.id}>
            <TopicCardItem topic={topic} />
          </li>
        ))}
      </ul>
    </div>
  );
}
