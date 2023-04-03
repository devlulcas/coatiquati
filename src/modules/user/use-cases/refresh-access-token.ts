import type { UserRepositoryInterface } from '../repositories/user.repository';
import type { AuthServiceProviderInterface } from '../services/auth.service';

export class RefreshAccessToken {
	constructor(
		private authService: AuthServiceProviderInterface,
		private userRepository: UserRepositoryInterface
	) {}

  public async execute(refreshToken: string, token: string): Promise<string> {
    const payload = await this.authService.verifyToken(token);

    if (!payload) {
      throw new Error('Invalid token');
    }     

    const refreshTokenPayload = await this.authService.verifyRefreshToken(refreshToken);

    if (!refreshTokenPayload) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.userRepository.findById(refreshTokenPayload.id);

    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = await this.authService.generateToken(user);
  
    return accessToken;
  }
}
