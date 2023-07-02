import type { ResultType } from '$lib/types/result';
import type { UserRepository } from '../repositories/user.repository';
import type { AuthUser, AuthUserId } from '../schemas/auth-user';

export class GetUserProfile {
	constructor(private userRepository: UserRepository) {}

	async execute(id: AuthUserId): Promise<ResultType<AuthUser>> {
		return this.userRepository.findById(id);
	}
}
