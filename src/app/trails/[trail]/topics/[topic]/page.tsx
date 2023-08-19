import { getTopicUseCase } from '@/modules/topic/use-cases/get-topic-use-case';

type PageProps = {
  params: {
    topic: string;
  };
};

export default async function Page({ params }: PageProps) {
  const topicId = Number(params.topic);

  const topicData = await getTopicUseCase({ id: topicId });

  return (
    <div className="py-8 container">
      <pre>{JSON.stringify({ topicData, params })}</pre>
    </div>
  );
}
