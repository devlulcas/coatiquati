import { Fail, type ResultType } from '$lib/types/result';
import type { Session } from 'lucia-auth';
import type { SignUpWithUsernameDTO } from '../dtos/sign-up-with-username.dto';
import type { UserRepository } from '../repositories/user.repository';
import type { AuthService } from '../services/auth.service';
import type { EmailClient } from '$src/modules/email/infra/email-client';
import { welcomeMail } from '$src/modules/email/templates/welcome';

export class SignUpWithUsername {
	constructor(
		private userRepository: UserRepository,
		private authService: AuthService,
		private mailClient: EmailClient
	) {}

	async execute(data: SignUpWithUsernameDTO): Promise<ResultType<Session>> {
		const userExists = await this.userRepository.findByEmail(data.email);

		if (userExists.data?.id) {
			return Fail('E-mail já cadastrado.');
		}

		const sessionResult = await this.authService.signUpWithUsername({
			username: data.username,
			password: data.password,
			email: data.email,
			name: data.name
		});

		if (sessionResult.error) {
			return sessionResult;
		}

		const userResult = await this.userRepository.findById(sessionResult.data.userId);

		if (userResult.error) {
			return userResult;
		}

		await this.mailClient.sendEmail({
			to: userResult.data.email,
			subject: 'Bem vindo ao Coati!',
			body: welcomeMail({ username: userResult.data.username })
		});

		return sessionResult;
	}
}
