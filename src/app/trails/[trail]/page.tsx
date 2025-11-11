import { env } from '@/env';
import { getTopicsQuery } from '@/modules/topic/actions/get-topics-query';
import { TopicCardItem } from '@/modules/topic/components/topic-card-item';
import { getTrailByIdQuery } from '@/modules/trail/actions/get-trail-by-id-query';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import { isFail, unwrapOr } from '@/shared/lib/result';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

const getTrailByIdWithCache = cache(async (trailId: number) => {
  const trailResult = await getTrailByIdQuery(trailId);

  if (isFail(trailResult)) {
    notFound();
  }

  return trailResult.value;
});

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const trailId = Number(params.trail);
  const trail = await getTrailByIdWithCache(trailId);

  return {
    title: trail.title,
    description: trail.description,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${env.NEXT_PUBLIC_WEBSITE}/trails/${trailId}`,
      title: trail.title,
      description: trail.description,
    },
  };
}

type PageProps = {
  params: Promise<{
    trail: string;
  }>;
};

export default async function Page(props: PageProps) {
  const params = await props.params;
  const trailId = Number(params.trail);

  const [trail, topicsResult] = await Promise.all([
    getTrailByIdWithCache(trailId),
    getTopicsQuery(trailId),
  ]);

  const topics = unwrapOr(topicsResult, []);

  return (
    <div className="container py-8">
      <TrailHeading trail={trail} className="mb-8" />

      {topics.length === 0 && (
        <p className="text-center text-lg">Nenhum tópico encontrado</p>
      )}

      <h2 className="mb-4 text-2xl font-bold">{topics.length} tópicos</h2>

      <ul className="flex flex-col gap-4 border-l-2 border-border pl-4">
        {topics.map((topic) => (
          <li key={topic.id}>
            <TopicCardItem topic={topic} />
          </li>
        ))}
      </ul>
    </div>
  );
}
