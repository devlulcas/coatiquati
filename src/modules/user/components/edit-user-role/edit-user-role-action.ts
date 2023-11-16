'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { SetUserRoleUseCase, type SetUserRoleSchema } from '@/modules/user/use-cases/set-user-role-use-case';
import { revalidatePath } from 'next/cache';

export async function editUserRoleAction(data: SetUserRoleSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar as permissões de um usuário.');
  }

  const setUserRoleUseCase = new SetUserRoleUseCase();

  const user = await setUserRoleUseCase.execute(data, session);

  revalidatePath('/dashboard');
  revalidatePath('/profile/' + user.username);
}
