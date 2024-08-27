import { NewRichTextContentForm } from '@/modules/rich-text-content/components/new-rich-text-content-form';
import { getTopicQuery } from '@/modules/topic/actions/get-topic-query';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { isFail } from '@/shared/lib/result';

type PageProps = {
  params: {
    topic: string;
  };
};

export default async function Page({ params }: PageProps) {
  const topicId = Number(params.topic);
  const topicResult = await getTopicQuery(topicId);

  if (isFail(topicResult)) {
    return <ErrorMessage message={topicResult.fail} className="container my-8" />;
  }

  return (
    <div className="container py-8">
      <header className="mb-3 flex flex-col gap-2 rounded border bg-background/75 p-2">
        <h2 className="mb-4 break-words text-2xl font-bold">{topicResult.value.title}</h2>
        <p className="break-words text-lg text-muted-foreground">{topicResult.value.description}</p>
      </header>

      <NewRichTextContentForm defaultValues={topicResult.value} />
    </div>
  );
}
