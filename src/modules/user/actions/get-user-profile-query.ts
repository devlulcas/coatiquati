'use server';

import { userSignInSchema } from '@/modules/auth/schemas/user-sign-in-schema';
import { UserRepository } from '../repositories/user-repository';
import { type UserProfile } from '../types/user';

const getUserProfileSchema = userSignInSchema.pick({ username: true });

export async function getUserProfileQuery(username: string): Promise<UserProfile | null> {
  const validatedParams = getUserProfileSchema.safeParse({ username });

  if (!validatedParams.success) {
    throw new Error('Parâmetros de busca de perfil inválidos');
  }

  const userRepository = new UserRepository();

  return userRepository.getUserProfile(validatedParams.data.username);
}
