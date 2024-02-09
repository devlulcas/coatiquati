import { ContributorList } from '@/modules/user/components/contributor-list';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createTrailCategoryUrl, createTrailUrl } from '../../lib/create-trail-url';
import { type Trail } from '../../types/trail';

type TrailCardProps = {
  trail: Trail;
};

export function TrailCard({ trail }: TrailCardProps) {
  const trailSlug = createTrailUrl(trail.id);
  const userProfileSlug = trail.author ? createProfileUrl(trail.author.username) : '/';
  const updatedAt = new Date(trail.updatedAt).toLocaleString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="coati-animated-line rounded-xl bg-gradient-to-r from-brand-500 via-purple-600 to-brand-500 p-[1px]">
      <article className="flex w-full max-w-xs flex-col items-center justify-center overflow-hidden rounded-xl border bg-card text-card-foreground shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Link href={trailSlug}>
            <Image fill alt={trail.title} src={trail.thumbnail} className="w-full object-contain" />
          </Link>

          <div className="absolute right-2 top-2">
            {trail.category && (
              <Link
                className="h-fit rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground"
                href={createTrailCategoryUrl(trail.category.name)}
              >
                {trail.category.name}
              </Link>
            )}
          </div>

          <div className="absolute bottom-2 left-2 flex gap-2">
            {trail.author && (
              <Link href={userProfileSlug}>
                <Avatar className="rounded-full rounded-bl-none">
                  <AvatarFallback className="rounded-full rounded-bl-none">
                    {trail.author.username.slice(0, 2)}
                  </AvatarFallback>

                  <AvatarImage
                    className="rounded-full rounded-bl-none"
                    src={trail.author.avatar}
                    alt={trail.author.username}
                  />
                </Avatar>
              </Link>
            )}

            <ContributorList contributors={trail.contributors.map(contributor => contributor.user)} />
          </div>
        </div>

        <div className="flex h-fit w-full flex-col justify-between p-4">
          <div>
            <h2 className="line-clamp-2 min-h-[2lh] break-words text-base font-black uppercase lg:text-xl">
              {trail.title}
            </h2>

            <p className="mt-2 line-clamp-3 min-h-[3lh] w-full break-words text-sm text-card-foreground/75">
              {trail.description}
            </p>

            <time className="text-card-foreground-500 mt-1 block text-xs lg:mt-2" dateTime={trail.updatedAt}>
              Atualizado em {updatedAt}
            </time>
          </div>

          <div className="mt-1 flex w-full gap-2">
            <Button size="sm" asChild className="w-full items-center gap-2">
              <Link href={trailSlug}>
                Ver mais
                <ArrowRightIcon size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
