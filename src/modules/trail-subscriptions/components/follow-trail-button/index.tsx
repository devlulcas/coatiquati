'use client';

import { subscribeToTrailMutation } from '@/modules/trail-subscriptions/actions/subscribe-to-trail-mutation';
import type { TrailId } from '@/modules/trail/types/trail';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { Loader2Icon, StarIcon, StarOffIcon } from 'lucide-react';

type FollowTrailButtonProps = {
  trailId: TrailId;
  isAlreadyFollowing: boolean;
};

export function FollowTrailButton({ trailId, isAlreadyFollowing }: FollowTrailButtonProps) {
  const { toast } = useToast();

  const subscribeToTrailMutationState = useServerActionMutation({
    serverAction: subscribeToTrailMutation.bind(null, trailId),
    onFailedAction: error => {
      toast({
        title: 'Erro ao seguir trilha',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({
        title: isAlreadyFollowing ? 'Parou de seguir trilha' : 'Seguiu trilha',
        variant: 'success',
      });
    },
  });

  return (
    <form action={subscribeToTrailMutationState.mutate} className="w-full">
      <button className="group flex w-full items-center justify-start gap-2 rounded border bg-background">
        <div className="flex h-10 w-10 items-center justify-center border-r">
          {subscribeToTrailMutationState.isPending ? (
            <Loader2Icon className="animate-spin" />
          ) : isAlreadyFollowing ? (
            <StarOffIcon />
          ) : (
            <StarIcon />
          )}
        </div>

        {isAlreadyFollowing ? 'Parar de seguir' : 'Seguir'}
      </button>
    </form>
  );
}
