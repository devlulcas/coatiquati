'use client';

import { authClient } from '@/modules/auth/lib/auth-client';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { SkullIcon } from 'lucide-react';
import { useState } from 'react';
import { useCurrentUserDataQuery } from '../../hooks/use-user-data-query';
import type { PublicUser } from '../../types/user';

type EditUserRoleProps = {
  user: PublicUser;
};

export function EditUserRole({ user }: EditUserRoleProps) {
  const { toast } = useToast();

  const [isConfirming, setIsConfirming] = useState(false);

  const currentUserDataQuery = useCurrentUserDataQuery();

  const canSetRoleQuery = useQuery({
    queryKey: ['has-permission', currentUserDataQuery.data?.id],
    enabled: !!currentUserDataQuery.data,
    queryFn: async () => {
      if (!currentUserDataQuery.data) {
        return false;
      }

      const canSetRole = await authClient.admin.hasPermission({
        userId: currentUserDataQuery.data.id,
        permissions: {
          user: ['set-role'],
        },
      });

      if (canSetRole.error) {
        throw new Error(canSetRole.error.message);
      }

      return canSetRole.data.success;
    },
  });

  const openConfirmDialog = () => setIsConfirming(true);

  const closeConfirmDialog = () => setIsConfirming(false);

  const flippedRole = user.role === 'admin' ? 'user' : 'admin';

  const mutation = useMutation({
    mutationFn: async () => {
      if (!currentUserDataQuery.data) {
        throw new Error('Usuário não autenticado');
      }

      if (!canSetRoleQuery.data || user.role === 'superAdmin') {
        throw new Error(
          'Usuário não tem permissão para editar o papel do usuário'
        );
      }

      await authClient.admin.setRole({
        userId: user.id,
        role: flippedRole,
      });
    },
    onSuccess: () => {
      toast({ title: `${user.username} agora é um ${flippedRole}` });
      closeConfirmDialog();
    },
    onError: (error) => {
      toast({
        title: 'Erro ao editar permissão do usuário',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const flippedRoleLabel = {
    admin: 'usuário',
    user: 'administrador',
  };

  return (
    <Dialog open={isConfirming}>
      <Button
        disabled={mutation.isPending}
        onClick={openConfirmDialog}
        variant="ghost"
        className="w-full text-red-600"
      >
        {`Torná-lo ${flippedRoleLabel[flippedRole]}`}
      </Button>

      <DialogContent hideCloseButton>
        <DialogTitle className="leading-relaxed">
          Tem certeza que deseja tornar
          <strong className="mx-2 text-red-600">{user.username}</strong>
          {flippedRoleLabel[flippedRole]}?
        </DialogTitle>

        <DialogDescription className="flex items-center justify-center py-10">
          <SkullIcon className="h-24 w-24 text-red-600" />
        </DialogDescription>

        <DialogFooter className="flex w-full gap-4">
          <Button
            onClick={closeConfirmDialog}
            variant="outline"
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>

          <Button
            onClick={() => mutation.mutate()}
            variant="destructive"
            isLoading={mutation.isPending}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
