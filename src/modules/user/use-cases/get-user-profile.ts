import type { ResultType } from '$lib/types/result';
import type { UserRepository } from '../repositories/user.repository';
import type { User, UserId } from '../types/user';

export class GetUserProfile {
	constructor(private userRepository: UserRepository) {}

	async execute(id: UserId): Promise<ResultType<User>> {
		return this.userRepository.findById(id);
	}
}
