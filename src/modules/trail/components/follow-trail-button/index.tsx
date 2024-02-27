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
      <Button className="group w-full items-center gap-2">
        <StarIcon
          className={
            isAlreadyFollowing
              ? 'fill-current text-brand-500'
              : 'fill-current text-brand-300 group-hover:text-brand-500'
          }
        />
        {isAlreadyFollowing ? 'Parar de seguir' : 'Seguir'}
      </Button>
    </form>
  );
}
