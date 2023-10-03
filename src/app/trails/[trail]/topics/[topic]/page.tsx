import { PreviewRichTextContent } from '@/modules/content/components/preview-rich-text-content';
import type {
  Content,
  ContentWithFile,
  ContentWithImage,
  ContentWithRichTextPreview,
  ContentWithVideo
} from '@/modules/content/types/content';
import { getTopicUseCase } from '@/modules/topic/use-cases/get-topic-use-case';
import Image from 'next/image';
import Link from 'next/link';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';

type PageProps = {
  params: {
    topic: string;
  };
};

export default async function Page({ params }: PageProps) {
  const topicId = Number(params.topic);

  const topicData = await getTopicUseCase({ id: topicId });

  return (
    <div className="py-8 container">
      <header className="flex p-2 border rounded flex-col gap-2">
        <h2 className="text-2xl font-bold mb-4">{topicData.title}</h2>
        <p className="text-lg text-muted-foreground">{topicData.description}</p>

        <ul className="flex gap-2 items-center">
          {topicData.contents.map(content => (
            <li key={content.id} className="px-2 py-1 border rounded-full bg-card/90 text-card-foreground">
              {content.contentType}
            </li>
          ))}
        </ul>
      </header>

      <h3 className="text-xl font-bold mb-4">Conteúdos</h3>

      <ul className="flex flex-col gap-3">
        {topicData.contents.map(content => (
          <li key={content.id} className="flex flex-col gap-2">
            <h4 className="text-lg font-bold">{content.title}</h4>
            <RenderCorrectContentCard content={content} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RenderCorrectContentCard({ content }: { content: Content }) {
  switch (content.contentType) {
    case 'file':
      return <RenderFileContentCard content={content} />;
    case 'image':
      return <RenderImageContentCard content={content} />;
    case 'video':
      return <RenderVideoContentCard content={content} />;
    case 'rich_text':
      return <RenderRichTextContentCard content={content} />;
    default:
      throw new Error('Tipo de conteúdo inválido');
  }
}

function RenderFileContentCard({ content }: { content: ContentWithFile }) {
  const { content: data, ...meta } = content;

  return (
    <div className="flex flex-col gap-2 p-2 border rounded">
      <h5 className="text-lg font-bold">{meta.title}</h5>
      <Link href={data.url} className="text-md text-muted-foreground">
        {data.filename} - <span className="p-1 border rounded">{data.filesize}</span>
      </Link>
      <p className="text-md text-muted-foreground">{data.visualDescription}</p>
    </div>
  );
}

function RenderImageContentCard({ content }: { content: ContentWithImage }) {
  const { content: data, ...meta } = content;

  return (
    <div className="flex flex-col gap-2 p-2 border rounded">
      <h5 className="text-lg font-bold">{meta.title}</h5>
      <Image className="w-full rounded" alt={data.alt} src={data.src} width={1240} height={1080} />
      <p className="text-md text-muted-foreground">{data.description}</p>
    </div>
  );
}

function RenderVideoContentCard({ content }: { content: ContentWithVideo }) {
  const { content: data, ...meta } = content;

  return (
    <div className="flex flex-col gap-2 p-2 border rounded">
      <h5 className="text-lg font-bold">{meta.title}</h5>
      <LiteYouTubeEmbed id={data.src} title={meta.title} />
      <p className="text-md text-muted-foreground">{data.description}</p>
    </div>
  );
}

function RenderRichTextContentCard({ content }: { content: ContentWithRichTextPreview }) {
  const { content: data, ...meta } = content;

  return (
    <div className="flex flex-col gap-2 p-2 border rounded">
      <h5 className="text-lg font-bold">{meta.title}</h5>
      <PreviewRichTextContent richTextContent={data.previewAsJson} />
    </div>
  );
}
