import type { ResultType } from '$lib/types/result';
import type { ListUsersDTO } from '../dtos/list-users.dto';
import type { UserRepository } from '../repositories/user.repository';
import type { AuthUser } from '../schemas/auth-user';

export class ListUsers {
	constructor(private userRepository: UserRepository) {}

	async execute(data: ListUsersDTO): Promise<ResultType<AuthUser[]>> {
		return this.userRepository.findMany(data);
	}
}
