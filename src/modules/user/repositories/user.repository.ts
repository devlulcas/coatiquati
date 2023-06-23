import type { ResultType } from '$lib/types/result';
import type { ListUsersDTO } from '../dtos/list-users.dto';
import type { User } from '../entities/user.entity';

export interface UserRepository {
	findByEmail(email: string): Promise<ResultType<User>>;
	findById(id: string): Promise<ResultType<User>>;
	findMany(params: ListUsersDTO): Promise<ResultType<User[]>>;
	update(id: string, data: Partial<User>): Promise<ResultType<User>>;
}
