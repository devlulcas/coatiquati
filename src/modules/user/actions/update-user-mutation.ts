'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { UserRepository } from '../repositories/user-repository';
import { updateUserSchema, type UpdateUserSchema } from '../schemas/update-user-schema';

export async function updateUserMutation(params: UpdateUserSchema): Promise<void> {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar suas informações.');
  }

  if (isHighPrivilegeAdmin(session.user.role)) {
    throw new Error('Peça para um administrador de servidor para alterar diretamente as permissões do seu usuário.');
  }

  const validatedParams = updateUserSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const userRepository = new UserRepository();

  return userRepository.updateUser(session.userId, {
    avatar: validatedParams.data.avatar,
    username: validatedParams.data.username,
  });
}
