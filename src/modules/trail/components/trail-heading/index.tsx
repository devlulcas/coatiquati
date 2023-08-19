import type { User } from '@/modules/user/types/user';
import { UpdatedAt } from '@/shared/components/common/updated-at';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { Trail } from '../../types/trail';

type TrailHeadingProps = {
  trail: Trail;
  author: User;
  isAdmin?: boolean;
  className?: ClassValue;
};

export function TrailHeading({
  isAdmin,
  trail,
  author,
  className,
}: TrailHeadingProps) {
  return (
    <div
      className={cn(
        'relative w-full h-80 flex flex-col lg:flex-row gap-4',
        className
      )}
    >
      <Image
        src={trail.thumbnail}
        alt={trail.title}
        height={10}
        width={10}
        className="rounded-md z-[-2] absolute w-full h-full inset-0 blur-2xl opacity-75"
      />

      <Image
        src={trail.thumbnail}
        alt={trail.title}
        height={320}
        width={320}
        className="rounded-md border"
      />

      <div className="flex flex-col gap-4 w-full bg-background/50 p-4 rounded-md border">
        <h1 className="text-4xl font-bold truncate break-words whitespace-break-spaces w-full lg:max-w-screen-md">
          {trail.title}
        </h1>

        <p className="text-lg truncate max-w-prose">{trail.description}</p>

        <UpdatedAt updatedAt={trail.updatedAt} />

        {isAdmin && (
          <Link
            href={`/dashboard/trails/${trail.id}`}
            className="flex items-center gap-2 text-sm text-brand-500"
          >
            Visualizar trilha como administrador
          </Link>
        )}

        <Link
          className="absolute top-4 left-4 flex items-center gap-2 group"
          href={`/profile/${author.username}`}
        >
          <Avatar className="border border-foreground/25 rounded-full">
            <AvatarImage src={author.avatar} alt={author.username} />
            <AvatarFallback>{author.username}</AvatarFallback>
          </Avatar>

          <span className="text-sm transition-all -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
            {author.username}
          </span>
        </Link>
      </div>
    </div>
  );
}
