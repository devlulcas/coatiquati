'use server';

import { roles } from '@/modules/auth/constants/roles';
import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdmin, isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { z } from 'zod';
import { UserRepository } from '../repositories/user-repository';

const setUserRoleUseCaseSchema = z.object({
  userId: z.string(),
  role: z.string(),
});

export type SetUserRoleSchema = z.infer<typeof setUserRoleUseCaseSchema>;

export async function setUserRoleMutation(params: SetUserRoleSchema): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!user) {
    return fail('Você precisa estar logado para editar as permissões de um usuário.');
  }

  if (!isHighPrivilegeAdmin(user.role)) {
    log.warn('Usuário tentou alterar as permissões de outro usuário sem ter permissão para isso', {
      userId: user.id,
      username: user.username,
      targetUserId: params.userId,
      targetUsername: params.userId,
    });

    return fail('Nível de permissões insuficiente para editar as permissões de um usuário.');
  }

  const validatedParams = setUserRoleUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros de alteração de permissões inválidos.');
  }

  if (user.id === validatedParams.data.userId) {
    log.warn('Usuário tentou alterar suas próprias permissões', {
      userId: user.id,
      username: user.username,
    });

    return fail('Você não pode editar suas próprias permissões.');
  }

  const userRepository = new UserRepository();

  const targetUserResult = await wrapAsyncInResult(userRepository.getUserById(validatedParams.data.userId));

  if (targetUserResult.type === 'fail' || targetUserResult.value === null) {
    log.warn('Usuário não encontrado', {
      targetUserId: params.userId,
      targetUsername: params.userId,
    });

    return fail('Usuário não encontrado.');
  }

  const targetUser = targetUserResult.value;

  const desiredRole = isAdmin(validatedParams.data.role) ? roles.ADMIN : roles.USER;

  const verified = targetUser.verifiedAt ? new Date(targetUser.verifiedAt).getTime() < Date.now() : false;

  if (!verified && desiredRole === roles.ADMIN) {
    return fail('Usuário alvo não verificado. Logo, não pode ter suas permissões alteradas.');
  }

  if (isHighPrivilegeAdmin(targetUser.role)) {
    log.warn('Possível tentativa de golpe. Usuário tentou alterar permissão de usuário de alto nível', {
      userId: user.id,
      username: user.username,
      targetUserId: params.userId,
      targetUsername: params.userId,
    });

    return fail('Não é possível alterar a permissão de um administrador de nível tão alto.');
  }

  try {
    await userRepository.updateUser(validatedParams.data.userId, { role: desiredRole });
    return ok('Permissões de usuário alteradas com sucesso.');
  } catch (error) {
    log.error('Erro ao alterar as permissões de usuário', error);
    return fail('Erro ao alterar as permissões de usuário.');
  }
}
