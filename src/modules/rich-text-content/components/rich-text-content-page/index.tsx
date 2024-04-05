import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import { getRichTextContentQuery } from '../../actions/get-rich-text-content-query';

type RichTextContentPageProps = {
  contentId: number;
};

export default async function RichTextContentPage({ contentId }: RichTextContentPageProps) {
  const data = await getRichTextContentQuery(contentId);

  return (
    <div className="container py-8">
      <TrailHeading trail={data.parentTrail} />
      <h1 className="mb-2 mt-3 text-4xl font-bold">{data.parentTopic.title}</h1>
      <ReadonlyEditor content={data.richText.content.asJson} />
    </div>
  );
}
