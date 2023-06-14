import type { Nullish } from '$lib/types/nullish';
import type { Pagination } from '$lib/types/pagination';
import type { ResultType } from '$lib/types/result';
import type { User } from '../entities/user.entity';

export type FindManyUsersParams = {
	role?: Nullish<string>;
	username?: Nullish<string>;
	email?: Nullish<string>;
};

export interface UserRepository {
	findByEmail(email: string): Promise<ResultType<User>>;
	findById(id: string): Promise<ResultType<User>>;
	findMany(params: FindManyUsersParams, pagination: Pagination): Promise<ResultType<User[]>>;
}
