import { roles } from '@/modules/auth/constants/roles';
import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { TopicCardItem } from '@/modules/topic/components/topic-card-item';
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

  if (!trailData) redirect('/');

  const session = await getPageSession();

  const isAdmin = session?.user.role === roles.ADMIN;

  return (
    <div className="py-8 container">
      <TrailHeading isAdmin={isAdmin} trail={trailData} className="mb-8" />

      {trailData.topics.length === 0 && (
        <p className="text-lg text-center">Nenhum tópico encontrado</p>
      )}

      <h2 className="text-2xl font-bold mb-4">{trailData.topics.length} tópicos</h2>

      <ul className="flex flex-col gap-4 border-gray-300 border-l-2 pl-4">
        {trailData.topics.map(topic => (
          <li key={topic.id}>
            <TopicCardItem topic={topic} />
          </li>
        ))}
      </ul>
    </div>
  );
}
