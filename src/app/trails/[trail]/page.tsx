import { TopicCardItem } from '@/modules/topic/components/topic-card-item';
import { getTrailByIdQuery } from '@/modules/trail/actions/get-trail-by-id-query';
import { TrailHeading } from '@/modules/trail/components/trail-heading';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const trailId = Number(params.trail);

  const trailResult = await getTrailByIdQuery(trailId);

  if (trailResult.type === 'fail') {
    notFound();
  }

  return {
    title: trailResult.value.title,
    description: trailResult.value.description,
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `https://coatiquati.wiki/trails/${trailId}`,
      siteName: 'CoatiQuati',
      title: trailResult.value.title,
      description: trailResult.value.description,
      images: [
        {
          url: 'https://coatiquati.wiki/og.png',
          width: 1200,
          height: 630,
          alt: 'CoatiQuati',
        },
      ],
    },
  };
}

type PageProps = {
  params: {
    trail: string;
  };
};

export default async function Page({ params }: PageProps) {
  const trailId = Number(params.trail);

  const trailResult = await getTrailByIdQuery(trailId);

  if (trailResult.type === 'fail') {
    notFound();
  }

  return (
    <div className="container py-8">
      <TrailHeading trail={trailResult.value} className="mb-8" />

      {trailResult.value.topics.length === 0 && <p className="text-center text-lg">Nenhum tópico encontrado</p>}

      <h2 className="mb-4 text-2xl font-bold">{trailResult.value.topics.length} tópicos</h2>

      <ul className="flex flex-col gap-4 border-l-2 border-gray-300 pl-4">
        {trailResult.value.topics.map(topic => (
          <li key={topic.id}>
            <TopicCardItem topic={topic} />
          </li>
        ))}
      </ul>
    </div>
  );
}
