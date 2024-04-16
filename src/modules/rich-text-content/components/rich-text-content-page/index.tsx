import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import { getRichTextContentQuery } from '../../actions/get-rich-text-content-query';

type RichTextContentPageProps = {
  contentId: number;
};

export default async function RichTextContentPage({ contentId }: RichTextContentPageProps) {
  const result = await getRichTextContentQuery(contentId);

  if (result.type === 'fail') {
    return (
      <div className="container rounded bg-destructive/50 py-8 text-destructive-foreground">
        <p>Erro ao buscar conteúdo.</p>
        <p className="font-bold">{result.fail}</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <TrailHeading trail={result.value.parentTrail} />
      <h1 className="mb-2 mt-3 text-4xl font-bold">{result.value.parentTopic.title}</h1>
      <ReadonlyEditor content={result.value.richText.content.asJson} />
    </div>
  );
}
