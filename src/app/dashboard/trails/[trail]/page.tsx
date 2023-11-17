import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { NewTrailDialogTrigger } from '@/modules/topic/components/new-topic-dialog-trigger';
import { TopicsTable } from '@/modules/topic/components/topics-table';
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

  if (!trailData) redirect('/dashboard');

  const session = await getPageSession();

  const isAdmin = session !== null && isAdminOrAbove(session.user.role);

  return (
    <div className="flex flex-col gap-8">
      <TrailHeading isAdmin={isAdmin} trail={trailData} className="mb-8" />

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
