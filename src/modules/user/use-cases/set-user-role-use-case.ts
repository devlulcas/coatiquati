import { roles } from '@/modules/auth/constants/roles';
import type { Session } from '@/modules/auth/types/session';
import { isAdmin, isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { z } from 'zod';
import { DrizzleUserRepository } from '../repositories/user-repository';
import { type User } from '../types/user';

const setUserRoleUseCaseSchema = z.object({
  userId: z.string(),
  role: z.string(),
});

export type SetUserRoleSchema = z.infer<typeof setUserRoleUseCaseSchema>;

export async function setUserRoleUseCase(params: SetUserRoleSchema, session: Session): Promise<User> {
  if (!isHighPrivilegeAdmin(session.user.role)) {
    throw new Error('Nível de permissões insuficiente para editar as permissões de um usuário.');
  }

  const validatedParams = setUserRoleUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  if (session.user.id === validatedParams.data.userId) {
    throw new Error('Você não pode editar suas próprias permissões.');
  }

  const repository = new DrizzleUserRepository();

  const user = await repository.getUserById(validatedParams.data.userId);

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (user.emailVerified === false) {
    throw new Error('Usuário não verificado');
  }

  if (isHighPrivilegeAdmin(user.role)) {
    throw new Error('Não é possível alterar a permissão de um administrador de nível alto');
  }

  const role = isAdmin(validatedParams.data.role) ? roles.ADMIN : roles.USER;

  return repository.updateUser(validatedParams.data.userId, { role });
}
