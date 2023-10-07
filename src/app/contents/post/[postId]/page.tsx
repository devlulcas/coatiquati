import { PreviewRichTextContent } from '@/modules/content/components/preview-rich-text-content';
import { getRichTextContentUseCase } from '@/modules/content/use-cases/get-rich-text-content-use-case';
import { TrailHeading } from '@/modules/trail/components/trail-heading';

type PageProps = {
  params: {
    postId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const postId = Number(params.postId);

  const postData = await getRichTextContentUseCase({ id: postId });

  return (
    <div className="py-8 container">
      <TrailHeading trail={postData.trail} />
      <h1 className="text-4xl font-bold">{postData.topic.title}</h1>
      <PreviewRichTextContent richTextContent={postData.content.asJson} />
    </div>
  );
}
