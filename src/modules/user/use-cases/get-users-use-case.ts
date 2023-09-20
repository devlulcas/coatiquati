import { createPaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { z } from 'zod';
import { DrizzleUserRepository } from '../repositories/user-repository';
import { type User } from '../types/user';

const getUsersUseCaseSchema = createPaginationSchemaWithSearch(20, 0);

type GetUsersUseCaseSchema = Partial<z.infer<typeof getUsersUseCaseSchema>>;

export async function getUsersUseCase(
  params: GetUsersUseCaseSchema
): Promise<User[]> {
  const validatedParams = getUsersUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleUserRepository();

  try {
    return repository.getUsers(validatedParams.data);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar usuários');
  }
}
