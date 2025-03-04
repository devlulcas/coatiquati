import RichTextContentPage from '@/modules/rich-text-content/components/rich-text-content-page';

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const contentId = Number(params.id);
  return <RichTextContentPage contentId={contentId} />;
}
