'use client';

import { roles } from '@/modules/auth/constants/roles';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { SkullIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { type User } from '../../types/user';
import { editUserRoleAction } from './edit-user-role-action';

type EditUserRoleProps = {
  user: User;
};

export function EditUserRole({ user }: EditUserRoleProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  if (user.role === roles.HIGH_PRIVILEGE_ADMIN) return null;

  const isAdmin = user.role === roles.ADMIN;

  const flippedRole = isAdmin
    ? { value: roles.USER, label: 'Usuário' }
    : { value: roles.ADMIN, label: 'Administrador' };

  const openConfirmDialog = () => setIsConfirming(true);

  const closeConfirmDialog = () => setIsConfirming(false);

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await editUserRoleAction({ userId: user.id, role: flippedRole.value });
        toast({ title: `${user.username} agora é um ${flippedRole.label}` });
      } catch (error) {
        toast({
          title: 'Erro ao editar permissão do usuário',
          description: error instanceof Error ? error.message : String(error),
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Dialog open={isConfirming}>
      <Button
        onClick={openConfirmDialog}
        variant="ghost"
        className="w-full text-red-600"
      >
        {isAdmin ? 'Torná-lo usuário' : 'Elevar para administrador'}
      </Button>

      <DialogContent hideCloseButton>
        <DialogTitle className="leading-relaxed">
          Tem certeza que deseja tornar
          <strong className="mx-2 text-red-600">{user.username}</strong>
          {flippedRole.label}?
        </DialogTitle>

        <DialogDescription className="flex items-center justify-center py-10">
          <SkullIcon className="w-24 h-24 text-red-600" />
        </DialogDescription>

        <DialogFooter className="flex gap-4 w-full">
          <Button onClick={closeConfirmDialog} variant="outline">
            Cancelar
          </Button>

          <Button
            onClick={onSubmit}
            variant="destructive"
            isLoading={isLoading}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
