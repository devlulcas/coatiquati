import { TrailCard } from '@/modules/trail/components/trail-card';
import { ProfileHeading } from '@/modules/user/components/profile-heading';
import { getUserProfileUseCase } from '@/modules/user/use-cases/get-user-profile-use-case';

type PageProps = {
  params: {
    username: string;
  };
};

export const revalidate = 60;

export default async function Page({ params }: PageProps) {
  const profile = await getUserProfileUseCase({
    username: params.username,
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  return (
    <main className="py-8 container">
      <ProfileHeading user={profile} />

      {profile.authoredTrails.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Trilhas autoradas</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {profile.authoredTrails.map(trail => (
              <li key={trail.id} className="transition duration-500 ease-in-out  hover:scale-105">
                <TrailCard trail={trail} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
