import { roles } from '@/modules/auth/constants/roles';
import type { Session } from '@/modules/auth/types/session';
import { isAdmin, isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { z } from 'zod';
import { UserRepository } from '../repositories/user-repository';
import { type User } from '../types/user';

const setUserRoleUseCaseSchema = z.object({
  userId: z.string(),
  role: z.string(),
});

export type SetUserRoleSchema = z.infer<typeof setUserRoleUseCaseSchema>;

export class SetUserRoleUseCase {
  constructor(private readonly repository: UserRepository = new UserRepository()) {}

  async execute(params: SetUserRoleSchema, session: Session): Promise<User> {
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

    const targetUser = await this.repository.getUserById(validatedParams.data.userId);

    if (!targetUser) {
      log.warn('Usuário não encontrado', {
        targetUserId: params.userId,
        targetUsername: params.userId,
      });

      throw new Error('Usuário não encontrado.');
    }

    const desiredRole = isAdmin(validatedParams.data.role) ? roles.ADMIN : roles.USER;

    if (targetUser.emailVerified === false && desiredRole === roles.ADMIN) {
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

    return this.repository.updateUser(validatedParams.data.userId, { role: desiredRole });
  }
}
