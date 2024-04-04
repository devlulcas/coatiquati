'use server';

import { roles } from '@/modules/auth/constants/roles';
import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdmin, isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { z } from 'zod';
import { UserRepository } from '../repositories/user-repository';

const setUserRoleUseCaseSchema = z.object({
  userId: z.string(),
  role: z.string(),
});

export type SetUserRoleSchema = z.infer<typeof setUserRoleUseCaseSchema>;

export async function setUserRoleMutation(params: SetUserRoleSchema): Promise<void> {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para editar as permissões de um usuário.');
  }

  if (!isHighPrivilegeAdmin(session.user.role)) {
    log.warn('Usuário tentou alterar as permissões de outro usuário sem ter permissão para isso', {
      userId: session.user.id,
      username: session.user.username,
      targetUserId: params.userId,
      targetUsername: params.userId,
    });

    throw new Error('Nível de permissões insuficiente para editar as permissões de um usuário.');
  }

  const validatedParams = setUserRoleUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros de alteração de permissões inválidos.');
  }

  if (session.user.id === validatedParams.data.userId) {
    log.warn('Usuário tentou alterar suas próprias permissões', {
      userId: session.user.id,
      username: session.user.username,
    });

    throw new Error('Você não pode editar suas próprias permissões.');
  }

  const userRepository = new UserRepository();

  const targetUser = await userRepository.getUserById(validatedParams.data.userId);

  if (!targetUser) {
    log.warn('Usuário não encontrado', {
      targetUserId: params.userId,
      targetUsername: params.userId,
    });

    throw new Error('Usuário não encontrado.');
  }

  const desiredRole = isAdmin(validatedParams.data.role) ? roles.ADMIN : roles.USER;

  if (targetUser.verified === false && desiredRole === roles.ADMIN) {
    throw new Error('Usuário alvo não verificado. Logo, não pode ter suas permissões alteradas.');
  }

  if (isHighPrivilegeAdmin(targetUser.role)) {
    log.warn('Possível tentativa de golpe. Usuário tentou alterar permissão de usuário de alto nível', {
      userId: session.user.id,
      username: session.user.username,
      targetUserId: params.userId,
      targetUsername: params.userId,
    });

    throw new Error('Não é possível alterar a permissão de um administrador de nível tão alto.');
  }

  return userRepository.updateUser(validatedParams.data.userId, { role: desiredRole });
}
