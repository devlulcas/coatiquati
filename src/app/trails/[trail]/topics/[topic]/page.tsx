import { RenderCorrectContentCard } from '@/modules/content-renderer/components/render-correct-content-card';
import { ContributionOptionsButton } from '@/modules/topic/components/contribution-options-button';
import { GetTopicUseCase } from '@/modules/topic/use-cases/get-topic-use-case';
import { createTrailUrl } from '@/modules/trail/lib/create-trail-url';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeftIcon, FileIcon, ImageIcon, TextIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';

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
    <div className="container flex flex-col gap-2 py-8">
      <header className="flex flex-col gap-2 rounded border bg-background/75 p-2">
        <h2 className="mb-2 text-2xl font-bold">{topicData.title}</h2>
        <p className="text-lg text-muted-foreground">{topicData.description}</p>
      </header>

      <div className="flex flex-col gap-2 rounded border bg-background/75 p-2">
        <div className="flex flex-wrap gap-2">
          <span>Neste tópico seus colegas já contribuíram com:</span>
          <ul className="flex w-fit flex-wrap items-center gap-2">
            {contentTypesAvailable.map(contentType => (
              <li
                key={contentType.type}
                className="relative flex items-center gap-1 rounded-lg border bg-card/90 p-1 text-xs lowercase text-card-foreground"
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
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary" className="flex items-center gap-2">
            <Link href={createTrailUrl(topicData.trailId)}>
              <ArrowLeftIcon size={16} />
              Voltar
            </Link>
          </Button>
          <span>ou</span>
          <ContributionOptionsButton topicId={topicData.id} trailId={topicData.trailId} />
        </div>
      </div>

      <h3 className="mb-4 mt-6 text-xl font-bold">Conteúdos</h3>

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
