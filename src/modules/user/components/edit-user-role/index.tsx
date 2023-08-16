'use client';

import { roles } from '@/modules/auth/constants/roles';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { SkullIcon } from 'lucide-react';
import { useState } from 'react';
import { User } from '../../types/user';

type EditUserRoleProps = {
  user: User;
};

export function EditUserRole({ user }: EditUserRoleProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const isAdmin = user.role === roles.ADMIN;

  const flippedRole = isAdmin ? roles.USER : roles.ADMIN;

  const openConfirmDialog = () => {
    setIsConfirming(true);
  };

  const closeConfirmDialog = () => {
    setIsConfirming(false);
  };

  const onChangeConfirmation = () => {
    setIsConfirming(false);
    console.log('change role', flippedRole);
  };

  return (
    <Dialog open={isConfirming}>
      <DialogTrigger className="w-full">
        <Button
          onClick={openConfirmDialog}
          variant="ghost"
          className="w-full text-red-600"
        >
          {isAdmin ? 'Torná-lo usuário' : 'Elevar para administrador'}
        </Button>
      </DialogTrigger>

      <DialogContent hideCloseButton>
        <DialogTitle className="leading-relaxed">
          Tem certeza que deseja tornar
          <strong className="mx-2 text-red-600">{user.username}</strong>
          {isAdmin ? 'usuário' : 'administrador'}?
        </DialogTitle>

        <DialogDescription>
          <SkullIcon className="w-24 h-24 mx-auto my-10 text-red-600" />
        </DialogDescription>

        <DialogFooter className="flex gap-4 w-full">
          <Button onClick={closeConfirmDialog} variant="outline">
            Cancelar
          </Button>

          <Button onClick={onChangeConfirmation} variant="destructive">
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
