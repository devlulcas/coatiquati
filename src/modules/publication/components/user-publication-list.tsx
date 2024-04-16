import type { User } from '@/modules/user/types/user';
import { getPublicationsByUserIdQuery } from '../actions/get-publications-by-user-id-query';
import { PublicationCard } from './publication-card';

export async function UserPublicationList({ user }: { user: User }) {
  const pubsResult = await getPublicationsByUserIdQuery(user.id);

  if (pubsResult.type === 'fail') {
    return (
      <p className="rounded border-destructive bg-destructive/50 p-2 text-center text-destructive-foreground">
        {pubsResult.fail}
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded">
      {pubsResult.value.map(pub => (
        <li key={pub.id}>
          <PublicationCard publication={pub} author={user} />
        </li>
      ))}
    </ul>
  );
}
