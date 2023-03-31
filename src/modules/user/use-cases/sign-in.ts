import type { SignInDTO, UserSignInDTO } from '../dtos/auth.dto';
import type { UserRepositoryInterface } from '../repositories/user.repository';
import type { AuthServiceProviderInterface } from '../services/auth.service';
import { UserEmail } from '../value-objects/user-email';
import { UserPassword } from '../value-objects/user-password';

export class SignIn {
	constructor(
		private userRepository: UserRepositoryInterface,
		private authService: AuthServiceProviderInterface
	) {}

	async execute(data: UserSignInDTO): Promise<SignInDTO> {
		const userInputEmail = UserEmail.create(data.email);

		const user = await this.userRepository.findByEmail(userInputEmail.email).catch(() => {
			throw new Error('Invalid login credentials');
		});

		const userPassword = await UserPassword.create(data.password);

		if (!user) {
			throw new Error('User not found');
		}

		const isTheSamePassword = await userPassword.compare(user.password);

		if (!isTheSamePassword) {
			throw new Error('Invalid login credentials');
		}

		const token = await this.authService.generateToken({
			id: user.id
		});

		return {
			token
		};
	}
}
