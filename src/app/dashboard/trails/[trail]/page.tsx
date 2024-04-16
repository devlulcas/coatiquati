import { NewTopicDialogTrigger } from '@/modules/topic/components/new-topic-dialog-trigger';
import { TopicsTable } from '@/modules/topic/components/topics-table';
import { getTrailByIdQuery } from '@/modules/trail/actions/get-trail-by-id-query';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import { ErrorMessage } from '@/shared/components/common/error-message';

type PageProps = {
  params: {
    trail: string;
  };
};

export default async function Page({ params }: PageProps) {
  const trailId = Number(params.trail);

  const trailResult = await getTrailByIdQuery(trailId);

  if (trailResult.type === 'fail') {
    return <ErrorMessage message={trailResult.fail} className="container my-8" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <TrailHeading trail={trailResult.value} className="mb-8" />

      <section>
        <div className="mb-4 flex justify-between">
          <h2 className="text-xl">Tópicos da trilha</h2>
          <NewTopicDialogTrigger trailId={trailId} />
        </div>

        <TopicsTable data={trailResult.value.topics} />
      </section>
    </div>
  );
}
