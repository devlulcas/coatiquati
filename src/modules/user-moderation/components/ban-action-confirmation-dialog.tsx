'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { BirdIcon, SkullIcon } from 'lucide-react';
import { banUserMutation } from '../actions/ban-user-mutation';
import { unbanUserMutation } from '../actions/unban-user-mutation';

type BanActionConfirmationDialogProps = {
  reportId: number;
  user: {
    username: string;
    isBanned: boolean;
  };
};

export function BanActionConfirmationDialog({ reportId, user }: BanActionConfirmationDialogProps) {
  const { toast } = useToast();

  const banMutation = useServerActionMutation({
    serverAction: banUserMutation,
    onSuccessfulAction: () => {
      toast({ title: `Usuário ${user.username} banido` });
    },
    onFailedAction: error => {
      toast({
        title: 'Erro ao banir usuário',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
  });

  const unbanMutation = useServerActionMutation({
    serverAction: unbanUserMutation,
    onSuccessfulAction: () => {
      toast({ title: `Banimento de ${user.username} removido` });
    },
    onFailedAction: error => {
      toast({
        title: 'Erro ao remover banimento',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" className="items-center space-x-2" size="sm">
          {user.isBanned ? (
            <>
              Remover ban <BirdIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              Banir <SkullIcon className="h-4 w-4" />
            </>
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            {user.isBanned
              ? `Você deseja remover o banimento de ${user.username}?`
              : `Você deseja banir ${user.username}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          {user.isBanned ? (
            <AlertDialogAction onClick={() => unbanMutation.mutate({ username: user.username })}>
              Remover ban
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={() => banMutation.mutate({ reportId })}>Banir</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
