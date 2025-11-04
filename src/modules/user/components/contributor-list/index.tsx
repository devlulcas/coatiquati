import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import Link from 'next/link';
import type { Contributor } from '../../types/user';

type ContributorListProps = {
  contributors: Contributor[];
};

export function ContributorList({ contributors }: ContributorListProps) {
  return (
    <ul className="flex items-center">
      {contributors.map((contributor, index, list) => (
        <li
          key={contributor.id}
          className="-ml-2 first:ml-0"
          style={{ zIndex: list.length - index }}
        >
          <Link href={`/profile/${contributor.username}`}>
            <Avatar className="rounded-full border border-foreground/25">
              <AvatarFallback>{contributor.name.slice(0, 2)}</AvatarFallback>
              <AvatarImage src={contributor.image} alt={contributor.name} />
            </Avatar>
          </Link>
        </li>
      ))}
    </ul>
  );
}
