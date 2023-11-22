import { userSignInSchema } from '@/modules/auth/schemas/user-sign-in-schema';
import { type z } from 'zod';
import { UserRepository } from '../repositories/user-repository';
import { type UserProfile } from '../types/user';

const getUserProfileUseCaseSchema = userSignInSchema.pick({
  username: true,
});

type GetUserProfileUseCaseSchema = z.infer<typeof getUserProfileUseCaseSchema>;

export class GetUserProfileUseCase {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async execute(params: GetUserProfileUseCaseSchema): Promise<UserProfile | null> {
    const validatedParams = getUserProfileUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros de busca de perfil inválidos');
    }

    return this.userRepository.getUserProfile(validatedParams.data.username);
  }
}
