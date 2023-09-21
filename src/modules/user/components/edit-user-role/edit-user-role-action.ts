'use server';

import { getPageSession } from '@/modules/auth/utils/get-page-session';
import {
  setUserRoleUseCase,
  type SetUserRoleSchema,
} from '@/modules/user/use-cases/set-user-role-use-case';
import { revalidatePath } from 'next/cache';

export async function editUserRoleAction(data: SetUserRoleSchema) {
  const session = await getPageSession();

  if (!session) {
    throw new Error(
      'Você precisa estar logado para editar as permissões de um usuário.'
    );
  }

  const user = await setUserRoleUseCase(data, session);

  revalidatePath('/dashboard');
  revalidatePath('/profile/' + user.username);
}
