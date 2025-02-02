'use client';

import { roles } from '@/modules/auth/constants/roles';
import { isAdmin, isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { isFail } from '@/shared/lib/result';
import { SkullIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { setUserRoleMutation } from '../../actions/set-user-role-mutation';
import { useUsersQueryCleanup } from '../../hooks/use-users-query';
import { type User } from '../../types/user';

type EditUserRoleProps = {
  user: User;
};

export function EditUserRole({ user }: EditUserRoleProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const clearUsersQuery = useUsersQueryCleanup()

  if (isHighPrivilegeAdmin(user.role)) return null;

  const flippedRole = isAdmin(user.role)
    ? { value: roles.USER, label: 'Usuário' }
    : { value: roles.ADMIN, label: 'Administrador' };

  const openConfirmDialog = () => setIsConfirming(true);

  const closeConfirmDialog = () => setIsConfirming(false);

  const onSubmit = () => {
    startTransition(async () => {
      const mutation = await setUserRoleMutation({ userId: user.id, role: flippedRole.value });

      if (isFail(mutation)) {
        toast({
          title: 'Erro ao editar permissão do usuário',
          description: mutation.fail,
          variant: 'destructive',
        });
      } else {
        clearUsersQuery()
        toast({ title: `${user.username} agora é um ${flippedRole.label}` });
        closeConfirmDialog()
      }
    });
  };

  return (
    <Dialog open={isConfirming}>
      <Button onClick={openConfirmDialog} variant="ghost" className="w-full text-red-600">
        {isAdmin(user.role) ? 'Torná-lo usuário' : 'Elevar para administrador'}
      </Button>

      <DialogContent hideCloseButton>
        <DialogTitle className="leading-relaxed">
          Tem certeza que deseja tornar
          <strong className="mx-2 text-red-600">{user.username}</strong>
          {flippedRole.label}?
        </DialogTitle>

        <DialogDescription className="flex items-center justify-center py-10">
          <SkullIcon className="h-24 w-24 text-red-600" />
        </DialogDescription>

        <DialogFooter className="flex w-full gap-4">
          <Button onClick={closeConfirmDialog} variant="outline">
            Cancelar
          </Button>

          <Button onClick={onSubmit} variant="destructive" isLoading={isLoading}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
