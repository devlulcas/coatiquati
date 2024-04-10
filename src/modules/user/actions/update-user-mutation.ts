'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { asyncResult, fail, ok, type Result } from '@/shared/lib/result';
import { revalidatePath } from 'next/cache';
import { UserRepository } from '../repositories/user-repository';
import { updateUserSchema, type UpdateUserSchema } from '../schemas/update-user-schema';

export async function updateUserMutation(params: UpdateUserSchema): Promise<Result<string>> {
  const session = await getActionSession();

  if (!session) {
    return fail('Você precisa estar logado para editar suas informações.');
  }

  const userRepository = new UserRepository();

  const currentUserResult = await asyncResult(userRepository.getUserById(session.userId));

  if (currentUserResult.type === 'fail' || currentUserResult.value === null) {
    log.warn('Usuário não encontrado', {
      userId: session.userId,
      username: session.user.username,
    });

    return fail('Usuário não encontrado');
  }

  const isChangingEmail = params.email && params.email !== currentUserResult.value.email;

  if (isChangingEmail && isHighPrivilegeAdmin(session.user.role)) {
    return fail('Peça para um administrador de servidor para alterar diretamente as permissões do seu usuário.');
  }

  const validatedParams = updateUserSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos');
  }

  try {
    await userRepository.updateUser(session.userId, {
      avatar: validatedParams.data.avatar,
      username: validatedParams.data.username,
      email: validatedParams.data.email,
      verified: isChangingEmail ? false : currentUserResult.value.verified,
    });

    revalidatePath('/profile/' + session.user.username);

    return ok('Usuário atualizado com sucesso');
  } catch (error) {
    log.error('Erro ao atualizar usuário', error);
    return fail('Erro ao atualizar usuário');
  }
}
