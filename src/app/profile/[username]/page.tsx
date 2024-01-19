import { roles } from '@/modules/auth/constants/roles';
import { TrailCard } from '@/modules/trail/components/trail-card';
import { ProfileHeading } from '@/modules/user/components/profile-heading';
import { GetUserProfileUseCase } from '@/modules/user/use-cases/get-user-profile-use-case';

type PageProps = {
  params: {
    username: string;
  };
};

export default async function Page({ params }: PageProps) {
  const getUserProfileUseCase = new GetUserProfileUseCase();
  const profile = await getUserProfileUseCase.execute({
    username: decodeURIComponent(params.username),
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  // Usuários comuns não podem criar trilhas
  const hasAuthoredTrails = profile.authoredTrails.length > 0 && profile.role !== roles.USER;

  return (
    <main className="py-8 container">
      <ProfileHeading user={profile} />

      {hasAuthoredTrails && (
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
