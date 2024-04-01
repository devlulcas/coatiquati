import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { GetRichTextContentUseCase } from '@/modules/rich-text-content/use-cases/get-rich-text-content-use-case';
import { TrailHeading } from '@/modules/trail/components/trail-heading';

type RichTextContentPageProps = {
  contentId: number;
};

export default async function RichTextContentPage({ contentId }: RichTextContentPageProps) {
  const getRichTextContentUseCase = new GetRichTextContentUseCase();
  const postData = await getRichTextContentUseCase.execute({ id: contentId });

  return (
    <div className="container py-8">
      <TrailHeading trail={postData.trail} />
      <h1 className="mb-2 mt-3 text-4xl font-bold">{postData.topic.title}</h1>
      <ReadonlyEditor content={postData.content.asJson} />
    </div>
  );
}
