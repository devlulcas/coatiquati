import { createPaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { z } from 'zod';
import { UserRepository } from '../repositories/user-repository';
import { type User } from '../types/user';

const getUsersUseCaseSchema = createPaginationSchemaWithSearch(20, 0);

type GetUsersUseCaseSchema = Partial<z.infer<typeof getUsersUseCaseSchema>>;

export class GetUsersUseCase {
  constructor(private readonly repository: UserRepository = new UserRepository()) {}

  async execute(params?: GetUsersUseCaseSchema): Promise<User[]> {
    const validatedParams = getUsersUseCaseSchema.safeParse(params ?? {});

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para busca de usuários');
    }

    return this.repository.getUsers(validatedParams.data);
  }
}
