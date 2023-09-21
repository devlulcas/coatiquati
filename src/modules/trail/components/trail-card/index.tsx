import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import type { User } from '@/modules/user/types/user';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createTrailUrl } from '../../lib/create-trail-url';
import { type Trail } from '../../types/trail';

type TrailCardProps = {
  trail: Trail;
  author?: User;
};

export function TrailCard({ trail, author }: TrailCardProps) {
  const trailSlug = createTrailUrl(trail.id);
  const userProfileSlug = author ? createProfileUrl(author.username) : '/';

  return (
    <article className="flex flex-col justify-center items-center w-full bg-card text-card-foreground rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ease-in-out border">
      <div className="relative h-[300px] w-full">
        <Link href={trailSlug}>
          <Image
            fill
            alt={trail.title}
            src={trail.thumbnail}
            className="object-cover object-center w-full"
          />
        </Link>

        {author && (
          <div className="absolute bottom-2 left-2 flex gap-2">
            <Link href={userProfileSlug}>
              <Avatar>
                <AvatarFallback>{author.username.slice(0, 2)}</AvatarFallback>
                <AvatarImage src={author.avatar} alt={author.username} />
              </Avatar>
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 w-full h-fit flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase min-h-[2lh] line-clamp-2 break-words">
            {trail.title}
          </h2>
          <p className="mt-2 text-sm text-card-foreground/75 w-full min-h-[4lh] line-clamp-4 break-words">
            {trail.description}
          </p>

          <time
            className="block mt-2 text-sm text-card-foreground-500"
            dateTime={trail.updatedAt}
          >
            Atualizado em {new Date(trail.updatedAt).toLocaleString()}
          </time>
        </div>

        <div className="w-full flex gap-2 mt-4">
          <Button asChild className="w-full">
            <Link href={trailSlug}>
              Ver mais
              <ArrowRightIcon size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
