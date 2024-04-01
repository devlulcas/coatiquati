import { NewRichTextContentForm } from '@/modules/rich-text-content/components/new-rich-text-content-form';
import { GetTopicUseCase } from '@/modules/topic/use-cases/get-topic-use-case';

type PageProps = {
  params: {
    topic: string;
  };
};

export default async function Page({ params }: PageProps) {
  const topicId = Number(params.topic);

  const getTopicUseCase = new GetTopicUseCase();
  const topicData = await getTopicUseCase.execute({ id: topicId });

  return (
    <div className="container py-8">
      <header className="mb-3 flex flex-col gap-2 rounded border bg-background/75 p-2">
        <h2 className="mb-4 break-words text-2xl font-bold">{topicData.title}</h2>
        <p className="break-words text-lg text-muted-foreground">{topicData.description}</p>
      </header>

      <NewRichTextContentForm topicId={topicId} />
    </div>
  );
}
