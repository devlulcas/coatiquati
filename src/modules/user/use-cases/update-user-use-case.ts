import type { Session } from '@/modules/auth/types/session';
import { isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { z } from 'zod';
import { UserRepository } from '../repositories/user-repository';
import { type User } from '../types/user';

const updateUserUseCaseSchema = z.object({
  userId: z.string(),
  avatar: z.string().url().optional(),
  username: z.string().min(3).max(20).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserUseCaseSchema>;

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async execute(params: UpdateUserSchema, session: Session): Promise<User> {
    if (isHighPrivilegeAdmin(session.user.role)) {
      throw new Error('Peça para um administrador de servidor para alterar diretamente as permissões do seu usuário.');
    }

    const validatedParams = updateUserUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos');
    }

    if (session.user.id !== validatedParams.data.userId) {
      log.warn('Usuário tentou alterar os dados de outro usuário', {
        userId: session.user.id,
        username: session.user.username,
        targetUserId: params.userId,
        targetUsername: params.userId,
      });

      throw new Error('Você não pode editar dados de outros usuários.');
    }

    return this.userRepository.updateUser(validatedParams.data.userId, {
      avatar: validatedParams.data.avatar,
      username: validatedParams.data.username,
    });
  }
}
