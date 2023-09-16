import { userSignInSchema } from '@/modules/auth/schemas/user-sign-in-schema';
import { z } from 'zod';
import { createUserRepository } from '../repositories/user-repository';
import { type UserProfile } from '../types/user';

const getUserProfileUseCaseSchema = userSignInSchema.pick({
  username: true,
});

type GetUserProfileUseCaseSchema = z.infer<typeof getUserProfileUseCaseSchema>;

export async function getUserProfileUseCase(
  params: GetUserProfileUseCaseSchema
): Promise<UserProfile | null> {
  const validatedParams = getUserProfileUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = createUserRepository();

  try {
    return repository.getUserProfile(validatedParams.data.username);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar usuários');
  }
}
