import type { Pagination } from '$lib/types/pagination';
import type { ResultType } from '$lib/types/result';
import type { User } from '../entities/user.entity';
import type { FindManyUsersParams, UserRepository } from '../repositories/user.repository';

type ListUsersDTO = Partial<FindManyUsersParams>;

export class ListUsers {
	constructor(private userRepository: UserRepository) {}

	async execute(data?: ListUsersDTO): Promise<ResultType<User[]>> {
		const pagination: Pagination = data?.pagination ?? {
			page: 1,
			limit: 10
		};

		return this.userRepository.findMany({ pagination, ...data });
	}
}
