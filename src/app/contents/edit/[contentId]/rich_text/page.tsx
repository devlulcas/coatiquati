import { GetRichTextContentUseCase } from '@/modules/rich-text-content/use-cases/get-rich-text-content-use-case';

type PageProps = {
  params: {
    contentId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const contentId = Number(params.contentId);
  const getRichTextContentUseCase = new GetRichTextContentUseCase();
  const contentData = await getRichTextContentUseCase.execute({ id: contentId });

  return <pre>{JSON.stringify(contentData, null, 2)}</pre>;
}
