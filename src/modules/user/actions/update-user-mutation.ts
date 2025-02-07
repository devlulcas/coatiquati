'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { revalidatePath } from 'next/cache';
import { getUserById, updateUser } from '../repositories/user-repository';
import { updateUserSchema, type UpdateUserSchema } from '../schemas/update-user-schema';

export async function updateUserMutation(params: UpdateUserSchema): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!user) {
    return fail('Você precisa estar logado para editar suas informações.');
  }

  const currentUserResult = await wrapAsyncInResult(getUserById(user.id));

  if (currentUserResult.type === 'fail' || currentUserResult.value === null) {
    log.warn('Usuário não encontrado', {
      userId: user.id,
      username: user.username,
    });

    return fail('Usuário não encontrado');
  }

  const isChangingEmail = params.email && params.email !== currentUserResult.value.email;

  if (isChangingEmail && isHighPrivilegeAdmin(user.role)) {
    return fail('Peça para um administrador de servidor para alterar diretamente as permissões do seu usuário.');
  }

  const validatedParams = updateUserSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos');
  }

  try {
    await updateUser(user.id, {
      avatar: validatedParams.data.avatar,
      username: validatedParams.data.username,
      email: validatedParams.data.email,
      verifiedAt: isChangingEmail ? null : currentUserResult.value.verifiedAt,
    });

    revalidatePath('/profile/' + user.username);

    return ok('Usuário atualizado com sucesso');
  } catch (error) {
    log.error('Erro ao atualizar usuário', error);
    return fail('Erro ao atualizar usuário');
  }
}
