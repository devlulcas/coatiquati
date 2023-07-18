import type { ResultType } from '$lib/types/result';
import type { UsersSearchSchema } from '../dtos/users-search.dto';
import type { User, UserId } from '../types/user';

export interface UserRepository {
	findByEmail(email: string): Promise<ResultType<User>>;
	findById(id: UserId): Promise<ResultType<User>>;
	findMany(params: UsersSearchSchema): Promise<ResultType<User[]>>;
	update(id: UserId, data: Partial<User>): Promise<ResultType<User>>;
}
