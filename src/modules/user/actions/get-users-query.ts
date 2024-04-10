'use server';

import { createPaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { type z } from 'zod';
import { UserRepository } from '../repositories/user-repository';
import type { User } from '../types/user';

const getUsersUseCaseSchema = createPaginationSchemaWithSearch(20, 0);

type GetUsersUseCaseSchema = Partial<z.infer<typeof getUsersUseCaseSchema>>;

export async function getUsersQuery(params: GetUsersUseCaseSchema = {}): Promise<Result<User[]>> {
  const validatedParams = getUsersUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para busca de usuários');
  }

  const userRepository = new UserRepository();

  try {
    const users = await userRepository.getUsers(validatedParams.data);
    return ok(users);
  } catch (error) {
    log.error('Erro ao buscar usuários', error);
    return fail('Erro ao buscar usuários');
  }
}
