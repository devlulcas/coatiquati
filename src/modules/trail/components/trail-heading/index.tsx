import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { currentUserIsAlreadySubscribedQuery } from '@/modules/trail-subscriptions/actions/current-user-is-already-subscribed-query';
import { ContributorList } from '@/modules/user/components/contributor-list';
import { createProfileUrl } from '@/modules/user/lib/create-profile-url';
import { UpdatedAt } from '@/shared/components/common/updated-at';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import type { ClassValue } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { Trail } from '../../types/trail';
import { FollowTrailButton } from '../follow-trail-button';
import { VisualizeTrailAsAdmin } from './visualize-trail-as-admin';

type TrailHeadingProps = {
  trail: Trail;
  className?: ClassValue;
};

export async function TrailHeading({ trail, className }: TrailHeadingProps) {
  const allContributors = [trail.author, ...trail.contributors.map(contributor => contributor.user)];

  const session = await getPageSession();

  const isAlreadyFollowing = session !== null && (await currentUserIsAlreadySubscribedQuery(trail.id, session.userId));

  return (
    <div className={cn('relative flex min-h-80 w-full flex-col gap-4 lg:flex-row', className)}>
      <Link
        className="group absolute left-4 top-4 flex items-center gap-2"
        href={createProfileUrl(trail.author.username)}
      >
        <UserAvatar className="z-10" user={trail.author} />

        <span className="-translate-x-full rounded bg-brand-500 px-2 text-sm opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
          {trail.author.username}
        </span>
      </Link>

      <Image
        src={trail.thumbnail}
        alt={trail.title}
        height={10}
        width={10}
        className="absolute inset-0 z-[-2] h-full w-full animate-pulse rounded-md opacity-75 blur-2xl"
      />

      <Image
        src={trail.thumbnail}
        alt={trail.title}
        height={320}
        width={320}
        className="h-auto w-full rounded-md border lg:h-80 lg:w-80"
      />

      <div className="flex w-full flex-col gap-4 rounded-md border bg-background/50 p-4">
        <h1 className="break-all text-4xl font-bold">{trail.title}</h1>

        <p className="break-all text-lg">{trail.description}</p>

        <section className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 text-xl font-bold">{trail.contributors.length} contribuidores</h2>
          <ContributorList contributors={allContributors} />
        </section>

        <UpdatedAt updatedAt={trail.updatedAt} />

        <VisualizeTrailAsAdmin trailId={trail.id} />

        {session !== null ? (
          <div className="mt-auto">
            <FollowTrailButton trailId={trail.id} isAlreadyFollowing={isAlreadyFollowing} />
          </div>
        ) : (
          <Button asChild className="mt-auto">
            <Link href="/sign-in">Faça login para seguir esta trilha</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
