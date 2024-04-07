import { getTrailSubscriptionsByUserIdQuery } from '@/modules/trail-subscriptions/actions/get-trail-subscriptions-by-user-id-query';
import { getMostSubscribedCategory } from '@/modules/trail-subscriptions/lib/get-most-subscribed-category';
import { TrailCard } from '@/modules/trail/components/trail-card';
import { getUserProfileQuery } from '@/modules/user/actions/get-user-profile-query';
import { ProfileHeading } from '@/modules/user/components/profile-heading';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { StarsIcon } from 'lucide-react';

type PageProps = {
  params: {
    username: string;
  };
};

export default async function Page({ params }: PageProps) {
  const profile = await getUserProfileQuery(decodeURIComponent(params.username));

  if (!profile) {
    throw new Error('Profile not found');
  }

  const subscribedTrails = await getTrailSubscriptionsByUserIdQuery(profile.id);

  const mostSubscribedCategory = getMostSubscribedCategory(subscribedTrails);

  return (
    <main className="container py-4">
      <ProfileHeading user={profile} />

      {mostSubscribedCategory && (
        <p className="mt-8 flex items-center gap-2">
          <span className="flex items-center gap-1 rounded border bg-background px-2 py-1">
            <StarsIcon size={18} className="fill-current" />
            Curiosidade
            <StarsIcon size={18} className="fill-current" />
          </span>{' '}
          A categoria mais interessante para {profile.username} é <strong>{mostSubscribedCategory}</strong>.
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-bold">Seguidores</h2>

        {profile.followers.length === 0 && <p>Parece que {profile.username} ainda não tem seguidores.</p>}

        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {profile.followers.map(follower => (
            <li key={follower.username} className="flex items-center gap-2">
              <UserAvatar user={follower} /> {follower.username}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-bold">Seguindo</h2>

        {profile.following.length === 0 && <p>{profile.username} ainda não segue ninguém.</p>}

        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {profile.following.map(following => (
            <li key={following.username} className="flex items-center gap-2">
              <UserAvatar user={following} /> {following.username}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-bold">Trilhas inscritas</h2>

        {subscribedTrails.length === 0 && (
          <p>Parece que {profile.username} ainda não se inscreveu em nenhuma trilha.</p>
        )}

        <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {subscribedTrails.map(trail => (
            <li key={trail.id} className="transition duration-500 ease-in-out  hover:scale-105">
              <TrailCard trail={trail} />
            </li>
          ))}
        </ul>
      </section>

      {profile.authoredTrails.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold">Trilhas autoradas</h2>
          <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
