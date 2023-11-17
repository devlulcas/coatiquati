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
    <div className="py-8 container">
      <header className="flex p-2 border bg-background/75 rounded flex-col gap-2 mb-3">
        <h2 className="text-2xl font-bold mb-4 break-words">{topicData.title}</h2>
        <p className="text-lg text-muted-foreground break-words">{topicData.description}</p>
      </header>

      <NewRichTextContentForm topicId={topicId} />
    </div>
  );
}
