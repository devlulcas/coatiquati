import type { ResultType } from '$lib/types/result';
import type { UsersSearchSchema } from '../dtos/users-search.dto';
import type { UserRepository } from '../repositories/user.repository';
import type { User } from '../types/user';

export class ListUsers {
	constructor(private userRepository: UserRepository) {}

	async execute(data: UsersSearchSchema): Promise<ResultType<User[]>> {
		return this.userRepository.findMany(data);
	}
}
