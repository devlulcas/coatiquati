'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { revalidatePath } from 'next/cache';
import { UserRepository } from '../repositories/user-repository';
import { updateUserSchema, type UpdateUserSchema } from '../schemas/update-user-schema';

export async function updateUserMutation(params: UpdateUserSchema): Promise<void> {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar suas informações.');
  }

  const userRepository = new UserRepository();

  const currentUser = await userRepository.getUserById(session.userId);

  if (!currentUser) {
    throw new Error('Usuário não encontrado');
  }

  const isChangingEmail = params.email && params.email !== currentUser.email;

  if (isChangingEmail && isHighPrivilegeAdmin(session.user.role)) {
    throw new Error('Peça para um administrador de servidor para alterar diretamente as permissões do seu usuário.');
  }

  const validatedParams = updateUserSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  await userRepository.updateUser(session.userId, {
    avatar: validatedParams.data.avatar,
    username: validatedParams.data.username,
    email: validatedParams.data.email,
    verified: isChangingEmail ? false : currentUser.verified,
  });

  revalidatePath('/profile/' + session.user.username);
}
