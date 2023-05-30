import type { Pagination } from '$lib/types/pagination';
import type { ResultType } from '$lib/types/result';
import type { User } from '../entities/user.entity';

export type FindManyUsersParams = {
	pagination: Pagination;
	role?: string;
	username?: string;
	email?: string;
};

export interface UserRepository {
	findByEmail(email: string): Promise<ResultType<User>>;
	update(user: Partial<User>): Promise<ResultType<User>>;
	delete(userId: string): Promise<ResultType<User>>;
	findById(id: string): Promise<ResultType<User>>;
	findMany(params: FindManyUsersParams): Promise<ResultType<User[]>>;
}
