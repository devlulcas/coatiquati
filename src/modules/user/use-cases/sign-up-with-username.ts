import { Fail, type ResultType } from '$lib/types/result';
import type { Session } from 'lucia-auth';
import type { SignUpWithUsernameDTO } from '../dtos/sign-up-with-username.dto';
import type { UserRepository } from '../repositories/user.repository';
import type { AuthService } from '../services/auth.service';

export class SignUpWithUsername {
	constructor(private userRepository: UserRepository, private authService: AuthService) {}

	async execute(data: SignUpWithUsernameDTO): Promise<ResultType<Session>> {
		const userExists = await this.userRepository.findByEmail(data.email);

		if (userExists.data?.id) {
			return Fail('E-mail já cadastrado.');
		}

		const session = await this.authService.signUpWithUsername({
			username: data.username,
			password: data.password,
			email: data.email,
			name: data.name
		});

		return session;
	}
}
