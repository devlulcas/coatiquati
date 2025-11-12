'use client';

import { subscribeToTrailMutation } from '@/modules/trail-subscriptions/actions/subscribe-to-trail-mutation';
import { useToast } from '@/shared/components/ui/use-toast';
import { unwrap } from '@/shared/lib/result';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon, StarIcon, StarOffIcon } from 'lucide-react';

type FollowTrailButtonProps = {
  trailId: number;
  isAlreadyFollowing: boolean;
};

export function FollowTrailButton({
  trailId,
  isAlreadyFollowing,
}: FollowTrailButtonProps) {
  const { toast } = useToast();

  const subscribeToTrailMutationState = useMutation({
    mutationFn: async () => {
      return unwrap(await subscribeToTrailMutation(trailId));
    },
    onError: (error) => {
      toast({
        title: 'Erro ao seguir trilha',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      toast({
        title: isAlreadyFollowing ? 'Parou de seguir trilha' : 'Seguiu trilha',
        variant: 'success',
      });
    },
  });

  return (
    <form
      onSubmit={() => subscribeToTrailMutationState.mutate()}
      className="w-full"
    >
      <button
        type="button"
        disabled={subscribeToTrailMutationState.isPending}
        className="group flex w-full items-center justify-start gap-2 rounded border bg-background disabled:opacity-50"
      >
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
