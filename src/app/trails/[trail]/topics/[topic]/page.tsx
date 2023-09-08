import { TextEditor } from '@/modules/content/components/editor';

type PageProps = {
  params: {
    topic: string;
  };
};

export default async function Page({ params }: PageProps) {
  // const topicId = Number(params.topic);

  // const topicData = await getTopicUseCase({ id: topicId });

  return (
    <div className="py-8 container">
      <TextEditor />
    </div>
  );
}
