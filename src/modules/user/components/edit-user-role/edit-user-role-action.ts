'use server';

import { roles } from '@/modules/auth/constants/roles';
import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { revalidatePath } from 'next/cache';
import type { SetUserPermissionSchema } from '../../schemas/set-user-permission-schema';
import { setUserPermissionUseCase } from '../../use-cases/set-user-permission-use-case';

export async function submitEditUserRole(data: SetUserPermissionSchema) {
  const session = await getPageSession();

  if (!session) {
    throw new Error(
      'Você precisa estar logado para editar as permissões de um usuário.'
    );
  }

  if (session.user.role !== roles.HIGH_PRIVILEGE_ADMIN) {
    throw new Error(
      'Nível de permissões insuficiente para editar as permissões de um usuário.'
    );
  }

  if (session.user.id === data.userId) {
    throw new Error('Você não pode editar suas próprias permissões.');
  }

  setUserPermissionUseCase({
    userId: data.userId,
    permission: data.permission,
  });

  revalidatePath('/dashboard');
  revalidatePath('/profile/' + session.user.username);
}
