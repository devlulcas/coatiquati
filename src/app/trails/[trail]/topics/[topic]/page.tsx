import type {
  Content,
  ContentWithFile,
  ContentWithImage,
  ContentWithRichTextPreview,
  ContentWithVideo,
} from '@/modules/content/types/content';
import { ReadonlyEditor } from '@/modules/rich-text-content/components/readonly-editor';
import { ContributionOptionsButton } from '@/modules/topic/components/contribution-options-button';
import { GetTopicUseCase } from '@/modules/topic/use-cases/get-topic-use-case';
import { createTrailUrl } from '@/modules/trail/lib/create-trail-url';
import { YouTubeEmbed } from '@/modules/video-content/components/youtube-embed';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon, FileIcon, ImageIcon, TextIcon, VideoIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { RenderedContentWrapper } from './rendered-content-wrapper';

type PageProps = {
  params: {
    topic: string;
  };
};

const contentTypeIcon = {
  image: {
    label: 'Imagem',
    icon: <ImageIcon size={16} />,
  },
  rich_text: {
    label: 'Texto',
    icon: <TextIcon size={16} />,
  },
  video: {
    label: 'Vídeo',
    icon: <VideoIcon size={16} />,
  },
  file: {
    label: 'Arquivo',
    icon: <FileIcon size={16} />,
  },
};

export default async function Page({ params }: PageProps) {
  const topicId = Number(params.topic);

  const getTopicUseCase = new GetTopicUseCase();
  const topicData = await getTopicUseCase.execute({ id: topicId });

  // Unify and count
  const contentTypesAvailable: {
    count: number;
    type: keyof typeof contentTypeIcon;
  }[] = Object.entries(
    topicData.contents.reduce<Record<keyof typeof contentTypeIcon, number>>((acc, content) => {
      acc[content.contentType] = (acc[content.contentType] ?? 0) + 1;
      return acc;
    }, {} as any),
  ).map(([type, count]) => ({ type: type as keyof typeof contentTypeIcon, count }));

  return (
    <div className="py-8 container flex flex-col gap-2">
      <header className="flex p-2 border bg-background/75 rounded flex-col gap-2">
        <h2 className="text-2xl font-bold mb-2">{topicData.title}</h2>
        <p className="text-lg text-muted-foreground">{topicData.description}</p>

        <div className="flex gap-2">
          <Button asChild variant="secondary" className="flex gap-2 items-center">
            <Link href={createTrailUrl(topicData.trailId)}>
              <ArrowLeftIcon size={16} />
              Voltar para a trilha
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex p-2 border bg-background/75 rounded flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <span>Neste tópico seus colegas já contribuíram com:</span>
          <ul className="flex gap-2 items-center flex-wrap w-fit">
            {contentTypesAvailable.map(contentType => (
              <li
                key={contentType.type}
                className="p-1 relative flex items-center gap-1 border rounded-lg bg-card/90 text-card-foreground text-xs lowercase"
              >
                {contentTypeIcon[contentType.type].icon}
                <span>
                  {contentType.count} {contentType.count === 1 ? 'conteúdo' : 'conteúdos'} de
                </span>
                <span>{contentTypeIcon[contentType.type].label}</span>
              </li>
            ))}
          </ul>
        </div>

        <span>Contribua você também com imagens, vídeos, links e textos dos seus estudos neste tópico:</span>
        <ContributionOptionsButton topicId={topicData.id} trailId={topicData.trailId} />
      </div>

      <h3 className="text-xl font-bold mt-6 mb-4">Conteúdos</h3>

      <ul className="flex flex-col gap-3">
        {topicData.contents.map(content => (
          <li key={content.id}>
            <RenderCorrectContentCard content={content} />
          </li>
        ))}

        {topicData.contents.length === 0 && (
          <li className="flex flex-col gap-2">
            <p className="text-lg text-muted-foreground">Nenhum conteúdo encontrado</p>
          </li>
        )}
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
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <Link href={data.url} className="text-md text-muted-foreground">
        {data.filename} - <span className="p-1 border rounded">{data.filesize}</span>
      </Link>
      <p className="text-md text-muted-foreground">{data.visualDescription}</p>
    </RenderedContentWrapper>
  );
}

function RenderImageContentCard({ content }: { content: ContentWithImage }) {
  const { content: data, ...meta } = content;

  return (
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <Image title={meta.title} className="w-full rounded" alt={data.alt} src={data.src} width={1240} height={1080} />
      <p className="text-md text-muted-foreground">{data.description}</p>
    </RenderedContentWrapper>
  );
}

function RenderVideoContentCard({ content }: { content: ContentWithVideo }) {
  const { content: data, ...meta } = content;

  return (
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <YouTubeEmbed id={data.src} title={meta.title} />
      <p className="text-md text-muted-foreground">{data.description}</p>
    </RenderedContentWrapper>
  );
}

function RenderRichTextContentCard({ content }: { content: ContentWithRichTextPreview }) {
  const { content: data, ...meta } = content;

  return (
    <RenderedContentWrapper
      title={meta.title}
      by={meta.author}
      content={{ id: data.contentId, type: meta.contentType }}
    >
      <ReadonlyEditor content={data.previewAsJson} />
      <Link href={`/contents/${meta.id}`} className="text-md text-muted-foreground flex items-center gap-2">
        Ler mais <ArrowRightIcon size={16} />
      </Link>
    </RenderedContentWrapper>
  );
}
