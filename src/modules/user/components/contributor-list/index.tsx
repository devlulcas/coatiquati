import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import Link from 'next/link';
import { createProfileUrl } from '../../lib/create-profile-url';
import type { Contributor } from '../../types/user';

type ContributorListProps = {
  contributors: Contributor[];
};

export function ContributorList({ contributors }: ContributorListProps) {
  return (
    <ul className="flex items-center">
      {contributors.map((contributor, index, list) => (
        <li key={contributor.id} className="-ml-2 first:ml-0" style={{ zIndex: list.length - index }}>
          <Link href={createProfileUrl(contributor.username)}>
            <Avatar className="rounded-full border border-foreground/25">
              <AvatarFallback>{contributor.username.slice(0, 2)}</AvatarFallback>
              <AvatarImage src={contributor.avatar} alt={contributor.username} />
            </Avatar>
          </Link>
        </li>
      ))}
    </ul>
  );
}
