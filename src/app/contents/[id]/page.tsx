import RichTextContentPage from '@/modules/rich-text-content/components/rich-text-content-page';

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: PageProps) {
  const contentId = Number(params.id);

  return <RichTextContentPage contentId={contentId} />;
}
