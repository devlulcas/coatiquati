'use server';

import { userSignInSchema } from '@/modules/auth/schemas/user-sign-in-schema';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { UserRepository } from '../repositories/user-repository';
import { type UserProfile } from '../types/user';

const getUserProfileSchema = userSignInSchema.pick({ username: true });

export async function getUserProfileQuery(username: string): Promise<Result<UserProfile | null>> {
  const validatedParams = getUserProfileSchema.safeParse({ username });

  if (!validatedParams.success) {
    return fail('Parâmetros de busca de perfil inválidos');
  }

  const userRepository = new UserRepository();

  const profileResult = await wrapAsyncInResult(userRepository.getUserProfile(validatedParams.data.username));

  if (profileResult.type === 'fail') {
    return fail('Erro ao buscar perfil de usuário');
  }

  if (profileResult.value === null) {
    return ok(null);
  }

  return ok(profileResult.value);
}
