import { getRichTextContentQuery } from '@/modules/rich-text-content/actions/get-rich-text-content-query';

type PageProps = {
  params: {
    contentId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const contentId = Number(params.contentId);
  const contentData = await getRichTextContentQuery(contentId);

  return <pre>{JSON.stringify(contentData, null, 2)}</pre>;
}
