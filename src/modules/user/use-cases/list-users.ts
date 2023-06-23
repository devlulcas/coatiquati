import type { ResultType } from '$lib/types/result';
import type { ListUsersDTO } from '../dtos/list-users.dto';
import type { User } from '../entities/user.entity';
import type { UserRepository } from '../repositories/user.repository';

export class ListUsers {
	constructor(private userRepository: UserRepository) {}

	async execute(data: ListUsersDTO): Promise<ResultType<User[]>> {
		return this.userRepository.findMany(data);
	}
}
