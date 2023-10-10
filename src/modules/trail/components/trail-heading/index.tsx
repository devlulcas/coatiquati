import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import { UpdatedAt } from '@/shared/components/common/updated-at';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { createTrailUrl } from '../../lib/create-trail-url';
import type { Trail } from '../../types/trail';

type TrailHeadingProps = {
  trail: Trail;
  isAdmin?: boolean;
  className?: ClassValue;
};

export function TrailHeading({ isAdmin, trail, className }: TrailHeadingProps) {
  return (
    <div className={cn('relative w-full min-h-80 flex flex-col lg:flex-row gap-4', className)}>
      <Image
        src={trail.thumbnail}
        alt={trail.title}
        height={10}
        width={10}
        className="rounded-md z-[-2] absolute w-full h-full inset-0 blur-2xl opacity-75 animate-pulse"
      />

      <Image
        src={trail.thumbnail}
        alt={trail.title}
        height={320}
        width={320}
        className="rounded-md border w-full h-auto lg:w-80 lg:h-80"
      />

      <div className="flex flex-col gap-4 w-full bg-background/50 p-4 rounded-md border">
        <h1 className="text-4xl font-bold break-all">{trail.title}</h1>

        <p className="text-lg break-all">{trail.description}</p>

        <ul className="flex items-center">
          {trail.contributors.map(({ user }) => (
            <li key={user.id} className="first:ml-0 -ml-2">
              <Avatar className="border border-foreground/25 rounded-full">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username}</AvatarFallback>
              </Avatar>
            </li>
          ))}
        </ul>

        <UpdatedAt updatedAt={trail.updatedAt} />

        {isAdmin && (
          <Link href={createTrailUrl(trail.id, true)} className="flex items-center gap-2 text-sm text-brand-300">
            Visualizar trilha como administrador
          </Link>
        )}

        <Link
          className="absolute top-4 left-4 flex items-center gap-2 group"
          href={createProfileUrl(trail.author.username)}
        >
          <Avatar className="border border-foreground/25 rounded-full">
            <AvatarImage src={trail.author.avatar} alt={trail.author.username} />
            <AvatarFallback>{trail.author.username}</AvatarFallback>
          </Avatar>

          <span className="text-sm transition-all -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
            {trail.author.username}
          </span>
        </Link>
      </div>
    </div>
  );
}
