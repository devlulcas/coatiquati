'use client';

import { subscribeToTrailMutation } from '@/modules/trail-subscriptions/actions/subscribe-to-trail-mutation';
import { Button } from '@/shared/components/ui/button';
import { StarIcon } from 'lucide-react';
import type { Trail } from '../../types/trail';

type FollowTrailButtonProps = {
  trailId: Trail['id'];
  isAlreadyFollowing: boolean;
};

export function FollowTrailButton({ trailId, isAlreadyFollowing }: FollowTrailButtonProps) {
  const followTrailServerAction = subscribeToTrailMutation.bind(null, trailId);

  return (
    <form action={followTrailServerAction} className="w-full">
      <button className="group flex bg-background rounded border w-full items-center justify-start gap-2">
        <div className="flex h-10 w-10 items-center justify-center border-r">
          <StarIcon
            className={
              isAlreadyFollowing
                ? 'fill-current text-foreground'
                : 'fill-current text-foreground group-hover:text-brand-500'
            }
          />
        </div>

        {isAlreadyFollowing ? 'Parar de seguir' : 'Seguir'}
      </button>
    </form>
  );
}
