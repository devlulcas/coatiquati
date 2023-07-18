import type { ResultType } from '$lib/types/result';
import type { Session } from 'lucia-auth';
import type { SignInWithUsernameSchema } from '../dtos/sign-in-with-username.dto';
import type { UserRepository } from '../repositories/user.repository';
import type { AuthService } from '../services/auth.service';

export class SignInWithUsername {
	constructor(
		private authService: AuthService,
		private userRepository: UserRepository
	) {}

	async execute(data: SignInWithUsernameSchema): Promise<ResultType<Session>> {
		const sessionResult = await this.authService.signInWithUsername(data);

		if (sessionResult.error) {
			return sessionResult;
		}

		const userResult = await this.userRepository.findById(sessionResult.data.userId);

		if (userResult.error) {
			return userResult;
		}

		return sessionResult;
	}
}
