import type { User } from '@/modules/user/types/user';
import { isFail } from '@/shared/lib/result';
import { getPublicationsByUserIdQuery } from '../actions/get-publications-by-user-id-query';
import { PublicationCard } from './publication-card';

export async function UserPublicationList({ user }: { user: User }) {
  const pubsResult = await getPublicationsByUserIdQuery(user.id);

  if (isFail(pubsResult)) {
    return (
      <p className="rounded border-destructive bg-destructive/50 p-2 text-center text-destructive-foreground">
        {pubsResult.fail}
      </p>
    );
  }

  return (
    <ul className="overflow-hidden rounded">
      {pubsResult.value.map((pub, index, arr) => (
        <li key={pub.id}>
          <PublicationCard
            publication={pub}
            author={user}
            variant={arr.length === 1 ? 'single' : index === 0 ? 'top' : index === arr.length - 1 ? 'bottom' : 'middle'}
          />
        </li>
      ))}
    </ul>
  );
}
