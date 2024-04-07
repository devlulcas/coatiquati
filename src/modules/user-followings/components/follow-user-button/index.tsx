'use client';

import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { UserMinus2Icon, UserPlus2Icon } from 'lucide-react';
import { followUserMutation } from '../../actions/follow-user-mutation';

type FollowUserButtonProps = {
  userId: string;
  isAlreadyFollowing: boolean;
};

export function FollowUserButton({ userId, isAlreadyFollowing }: FollowUserButtonProps) {
  const { toast } = useToast();

  const followUserMutationState = useServerActionMutation({
    serverAction: followUserMutation.bind(null, userId),
    onFailedAction: error => {
      toast({
        title: 'Erro ao seguir usuário',
        description: error.message,
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({
        title: isAlreadyFollowing ? 'Parou de seguir usuário' : 'Seguiu usuário',
        variant: 'success',
      });
    },
  });

  return (
    <form action={followUserMutationState.mutate} className="w-full">
      <Button
        variant={isAlreadyFollowing ? 'destructive' : 'outline'}
        className="ml-auto flex items-center gap-2 text-sm"
      >
        {isAlreadyFollowing ? <UserMinus2Icon /> : <UserPlus2Icon />}
        {isAlreadyFollowing ? 'Deixar de seguir' : 'Seguir'}
      </Button>
    </form>
  );
}
