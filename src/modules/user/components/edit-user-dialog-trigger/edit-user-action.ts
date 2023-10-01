'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { revalidatePath } from 'next/cache';
import { updateUserUseCase, type UpdateUserSchema } from '../../use-cases/update-user-use-case';

export async function editUserAction(data: Omit<UpdateUserSchema, 'userId'>) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar as suas informações.');
  }

  const user = await updateUserUseCase({ ...data, userId: session.userId }, session);

  revalidatePath('/dashboard');
  revalidatePath('/profile/' + user.username);
}
