import { getRichTextContentQuery } from '@/modules/rich-text-content/actions/get-rich-text-content-query';

type PageProps = {
  params: Promise<{
    contentId: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const contentId = Number(params.contentId);
  const contentData = await getRichTextContentQuery(contentId);

  return <pre>{JSON.stringify(contentData, null, 2)}</pre>;
}
