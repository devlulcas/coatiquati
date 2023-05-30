import type { ResultType } from '$lib/types/result';
import type { Session } from 'lucia-auth';
import type { SignInWithUsernameDTO } from '../dtos/sign-in-with-username.dto';
import type { AuthService } from '../services/auth.service';
import type { UserRepository } from '../repositories/user.repository';
import type { EmailClient } from '$src/modules/email/infra/email-client';
import { welcomeMail } from '$src/modules/email/templates/welcome';

export class SignInWithUsername {
	constructor(
		private authService: AuthService,
		private userRepository: UserRepository,
		private mailClient: EmailClient
	) {}

	async execute(data: SignInWithUsernameDTO): Promise<ResultType<Session>> {
		const sessionResult = await this.authService.signInWithUsername(data);

		if (sessionResult.error) {
			return sessionResult;
		}

		const userResult = await this.userRepository.findById(sessionResult.data.userId);

		if (userResult.error) {
			return userResult;
		}

		await this.mailClient.sendEmail({
			to: userResult.data.email,
			subject: 'Bem vindo de volta ao Coati!',
			body: welcomeMail({ username: userResult.data.username })
		});

		return sessionResult;
	}
}
