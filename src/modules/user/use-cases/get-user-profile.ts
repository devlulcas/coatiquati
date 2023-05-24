import type { ResultType } from '$lib/types/result';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../repositories/user.repository';

export class GetUserProfile {
	constructor(private userRepository: UserRepository) {}

	async execute(id: string): Promise<ResultType<User>> {
		return this.userRepository.findById(id);
	}
}
