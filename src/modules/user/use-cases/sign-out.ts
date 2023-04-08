import type { UserRepositoryInterface } from "../repositories/user.repository";
import type { AuthServiceProviderInterface } from "../services/auth.service";

export class SignOut {
  constructor(
    private authService: AuthServiceProviderInterface,
    private userRepository: UserRepositoryInterface
  ) {}

  async execute(token: string): Promise<void> {
    const payload = await this.authService.verifyToken(token);

    const user = await this.userRepository.findById(payload.id);

    if (!user) {
      throw new Error('User not found');
    }
  }
}