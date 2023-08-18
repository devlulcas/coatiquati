import { getTrailUseCase } from '@/modules/trail/use-cases/get-trail-use-case';

type PageProps = {
  params: {
    trail: string;
  };
};

export default async function Page({ params }: PageProps) {
  const trailId = Number(params.trail);

  const trailData = await getTrailUseCase({ id: trailId });

  if (!trailData) {
    return (
      <div>
        {trailId}
        {JSON.stringify({ trailData, params })}
      </div>
    );
  }

  return (
    <div>
      <h1>{trailData.trail.title}</h1>
      <p>{trailData.trail.description}</p>
    </div>
  );
}
