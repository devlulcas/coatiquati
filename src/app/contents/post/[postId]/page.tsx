import { PreviewRichTextContent } from '@/modules/content/components/preview-rich-text-content';
import { getRichTextContentUseCase } from '@/modules/content/use-cases/get-rich-text-content-use-case';

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
      <PreviewRichTextContent richTextContent={postData.asJson} />
    </div>
  );
}
