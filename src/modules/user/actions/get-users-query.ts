import { createPaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { type z } from 'zod';
import { UserRepository } from '../repositories/user-repository';

const getUsersUseCaseSchema = createPaginationSchemaWithSearch(20, 0);

type GetUsersUseCaseSchema = Partial<z.infer<typeof getUsersUseCaseSchema>>;

export async function getUsersQuery(params: GetUsersUseCaseSchema = {}) {
  const validatedParams = getUsersUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para busca de usuários');
  }

  const userRepository = new UserRepository();

  return userRepository.getUsers(validatedParams.data);
}
