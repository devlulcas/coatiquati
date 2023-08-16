import { getTrailUseCase } from '@/modules/trail/use-cases/get-trail-use-case';

type PageProps = {
  params: {
    trail: string;
  };
};

export default async function Page({ params }: PageProps) {
  const trailId = Number(params.trail);

  const trail = await getTrailUseCase({ id: trailId });

  if (!trail) {
    return <div>Trilha não encontrada</div>;
  }

  return (
    <div>
      <h1>{trail.title}</h1>
      <p>{trail.description}</p>
    </div>
  );
}
