import { RenderCorrectContentCard } from '@/modules/content-renderer/components/render-correct-content-card';
import { getContentsQuery } from '@/modules/content/repositories/get-contents';
import type { BaseContent } from '@/modules/content/types/content';
import { getTopicQuery } from '@/modules/topic/actions/get-topic-query';
import { ContributionOptionsButton } from '@/modules/topic/components/contribution-options-button';
import { createTrailUrl } from '@/modules/trail/lib/create-trail-url';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { isFail, type Result, unwrapOr } from '@/shared/lib/result';
import { ArrowLeftIcon, ImageIcon, TextIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{
    topic: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const topicId = Number(params.topic);

  const [topicResult, contentsResult] = await Promise.all([
    getTopicQuery(topicId),
    getContentsQuery({ topicId }),
  ]);

  if (isFail(topicResult)) {
    return (
      <ErrorMessage message={topicResult.fail} className="container my-8" />
    );
  }

  const availableContentTypes = countContentType(unwrapOr(contentsResult, []));

  return (
    <div className="container flex flex-col gap-2 py-8">
      <header className="flex flex-col gap-2 rounded border bg-background/75 p-2">
        <h2 className="mb-2 text-2xl font-bold">{topicResult.value.title}</h2>
        <p className="text-lg text-muted-foreground">
          {topicResult.value.description}
        </p>
      </header>

      <div className="flex flex-col gap-2 rounded border bg-background/75 p-2">
        <div className="flex flex-wrap gap-2">
          <span>Neste tópico seus colegas já contribuíram com:</span>
          <ul className="flex w-fit flex-wrap items-center gap-2">
            {availableContentTypes.map((ct) => (
              <li
                key={ct.type}
                className="relative flex items-center gap-1 rounded-lg border bg-card/90 p-1 text-xs lowercase text-card-foreground"
              >
                {ct.icon}
                <span>
                  {ct.count} {ct.count === 1 ? 'conteúdo' : 'conteúdos'} de
                </span>
                <span>{ct.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <span>
          Contribua você também com imagens, vídeos, links e textos dos seus
          estudos neste tópico:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Link href={createTrailUrl(topicResult.value.trailId)}>
              <ArrowLeftIcon size={16} />
              Voltar
            </Link>
          </Button>
          <span>ou</span>
          <ContributionOptionsButton
            topicId={topicResult.value.id}
            trailId={topicResult.value.trailId}
          />
        </div>
      </div>

      <h3 className="mb-4 mt-6 text-xl font-bold">Conteúdos</h3>

      <TopicList contents={contentsResult} />
    </div>
  );
}

function TopicList({ contents }: { contents: Result<BaseContent[]> }) {
  if (isFail(contents)) {
    return <ErrorMessage message={contents.fail} className="container my-8" />;
  }

  if (contents.value.length === 0) {
    return (
      <li className="flex flex-col gap-2">
        <p className="text-lg text-muted-foreground">
          Nenhum conteúdo encontrado
        </p>
      </li>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {contents.value.map((data) => (
        <li key={data.id}>
          <RenderCorrectContentCard data={data} />
        </li>
      ))}
    </ul>
  );
}

function countContentType(
  data: BaseContent[]
): { count: number; icon: React.ReactNode; label: string; type: string }[] {
  const contentTypeIcon = {
    image: {
      type: 'image',
      label: 'Imagem',
      icon: <ImageIcon size={16} />,
      count: 0,
    },
    richText: {
      type: 'richText',
      label: 'Texto',
      icon: <TextIcon size={16} />,
      count: 0,
    },
    video: {
      type: 'video',
      label: 'Vídeo',
      icon: <VideoIcon size={16} />,
      count: 0,
    },
  };

  data.forEach((content) => {
    const contentType = content.imageContent
      ? 'image'
      : content.richTextContent
      ? 'richText'
      : content.videoContent
      ? 'video'
      : null;

    if (contentType) {
      contentTypeIcon[contentType].count++;
    }
  });

  return Object.values(contentTypeIcon);
}
