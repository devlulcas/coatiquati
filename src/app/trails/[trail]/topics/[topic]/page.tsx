import { RenderCorrectContentCard } from '@/modules/content-renderer/components/render-correct-content-card';
import type { Content } from '@/modules/content/types/content';
import { getTopicQuery } from '@/modules/topic/actions/get-topic-query';
import { ContributionOptionsButton } from '@/modules/topic/components/contribution-options-button';
import { createTrailUrl } from '@/modules/trail/lib/create-trail-url';
import { ErrorMessage } from '@/shared/components/common/error-message';
import { Button } from '@/shared/components/ui/button';
import { isFail } from '@/shared/lib/result';
import { ArrowLeftIcon, FileIcon, ImageIcon, TextIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{
    topic: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const topicId = Number(params.topic);

  const topicResult = await getTopicQuery(topicId);

  if (isFail(topicResult)) {
    return <ErrorMessage message={topicResult.fail} className="container my-8" />;
  }

  // Unify and count
  const contentTypesAvailable = accumulateContentType(topicResult.value.contents);

  return (
    <div className="container flex flex-col gap-2 py-8">
      <header className="flex flex-col gap-2 rounded border bg-background/75 p-2">
        <h2 className="mb-2 text-2xl font-bold">{topicResult.value.title}</h2>
        <p className="text-lg text-muted-foreground">{topicResult.value.description}</p>
      </header>

      <div className="flex flex-col gap-2 rounded border bg-background/75 p-2">
        <div className="flex flex-wrap gap-2">
          <span>Neste tópico seus colegas já contribuíram com:</span>
          <ul className="flex w-fit flex-wrap items-center gap-2">
            {contentTypesAvailable.map(ct => (
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

        <span>Contribua você também com imagens, vídeos, links e textos dos seus estudos neste tópico:</span>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="secondary" className="flex items-center gap-2">
            <Link href={createTrailUrl(topicResult.value.trailId)}>
              <ArrowLeftIcon size={16} />
              Voltar
            </Link>
          </Button>
          <span>ou</span>
          <ContributionOptionsButton topicId={topicResult.value.id} trailId={topicResult.value.trailId} />
        </div>
      </div>

      <h3 className="mb-4 mt-6 text-xl font-bold">Conteúdos</h3>

      <ul className="flex flex-col gap-3">
        {topicResult.value.contents.map(data => (
          <li key={data.id}>
            <RenderCorrectContentCard data={data} />
          </li>
        ))}

        {topicResult.value.contents.length === 0 && (
          <li className="flex flex-col gap-2">
            <p className="text-lg text-muted-foreground">Nenhum conteúdo encontrado</p>
          </li>
        )}
      </ul>
    </div>
  );
}

function accumulateContentType(
  data: Content[],
): { count: number; icon: React.ReactNode; label: string; type: string }[] {
  const contentTypeIcon = {
    image: {
      label: 'Imagem',
      icon: <ImageIcon size={16} />,
    },
    richText: {
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

  let res = [];

  for (const content of data) {
    const existentIdx = res.findIndex(it => it.type === content.contentType);

    if (existentIdx !== -1) {
      res[existentIdx].count++;
      continue;
    }

    const byContentType = contentTypeIcon[content.contentType] ?? contentTypeIcon.file;
    res.push({ count: 1, ...byContentType, type: content.contentType });
  }

  return res;
}
