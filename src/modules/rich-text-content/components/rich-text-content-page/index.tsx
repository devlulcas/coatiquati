import { getRichTextContentUseCase } from '@/modules/rich-text-content/use-cases/get-rich-text-content-use-case';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';

type RichTextContentPageProps = {
  contentId: number;
};

export default async function RichTextContentPage({ contentId }: RichTextContentPageProps) {
  const postData = await getRichTextContentUseCase({ id: contentId });

  return (
    <div className="py-8 container">
      <TrailHeading trail={postData.trail} />
      <h1 className="text-4xl mt-3 mb-2 font-bold">{postData.topic.title}</h1>
      <ReadonlyEditor content={postData.content.asJson} />
    </div>
  );
}
