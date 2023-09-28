import { roles } from '@/modules/auth/constants/roles';
import type { Session } from '@/modules/auth/types/session';
import { z } from 'zod';
import { DrizzleUserRepository } from '../repositories/user-repository';
import { type User } from '../types/user';

const updateUserUseCaseSchema = z.object({
  userId: z.string(),
  avatar: z.string().url().optional(),
  username: z.string().min(3).max(20).optional(),
  email: z.string().email().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserUseCaseSchema>;

export async function updateUserUseCase(
  params: UpdateUserSchema,
  session: Session
): Promise<User> {
  if (session.user.role === roles.HIGH_PRIVILEGE_ADMIN) {
    throw new Error(
      'Peça para um administrador de servidor para alterar diretamente as permissões do seu usuário.'
    );
  }

  const validatedParams = updateUserUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  if (session.user.id !== validatedParams.data.userId) {
    throw new Error('Você não pode editar permissões de outros usuários.');
  }

  const repository = new DrizzleUserRepository();

  try {
    return repository.updateUser(validatedParams.data.userId, {
      avatar: validatedParams.data.avatar,
      username: validatedParams.data.username,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar usuário');
  }
}