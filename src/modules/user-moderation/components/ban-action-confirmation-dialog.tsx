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
import { unwrap } from '@/shared/lib/result';
import { useMutation } from '@tanstack/react-query';
import { BirdIcon, SkullIcon } from 'lucide-react';
import { banUserMutation } from '../actions/ban-user-mutation';
import { unbanUserMutation } from '../actions/unban-user-mutation';

type BanActionConfirmationDialogProps = {
  reportId: number;
  user: {
    id: string;
    banned: boolean;
  };
};

export function BanActionConfirmationDialog({
  reportId,
  user,
}: BanActionConfirmationDialogProps) {
  const { toast } = useToast();

  const banMutation = useMutation({
    mutationFn: async () => {
      return unwrap(await banUserMutation({ reportId }));
    },
    onSuccess: () => {
      toast({ title: `Usuário banido` });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao banir usuário',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const unbanMutation = useMutation({
    mutationFn: async () => {
      return unwrap(await unbanUserMutation(user.id));
    },
    onSuccess: () => {
      toast({ title: `Banimento removido` });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover banimento',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" className="items-center space-x-2" size="sm">
          {user.banned ? (
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
            {user.banned
              ? `Você deseja remover o banimento do usuário?`
              : `Você deseja banir o usuário?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          {user.banned ? (
            <AlertDialogAction onClick={() => unbanMutation.mutate()}>
              Remover ban
            </AlertDialogAction>
          ) : (
            <AlertDialogAction onClick={() => banMutation.mutate()}>
              Banir
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
