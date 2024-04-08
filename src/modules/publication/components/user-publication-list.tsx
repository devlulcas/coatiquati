import type { User } from '@/modules/user/types/user';
import { getPublicationsByUserIdQuery } from '../actions/get-publications-by-user-id-query';
import { PublicationCard } from './publication-card';

export async function UserPublicationList({ user }: { user: User }) {
  const pubs = await getPublicationsByUserIdQuery(user.id);
  return (
    <ul className="overflow-hidden rounded">
      {pubs.map(pub => (
        <li key={pub.id}>
          <PublicationCard publication={pub} author={user} />
        </li>
      ))}
    </ul>
  );
}
