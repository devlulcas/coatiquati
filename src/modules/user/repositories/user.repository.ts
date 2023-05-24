import type { ResultType } from '$lib/types/result';
import type { User } from '../entities/user.entity';

export interface UserRepository {
	findByEmail(email: string): Promise<ResultType<User>>;
	update(user: Partial<User>): Promise<ResultType<User>>;
	delete(userId: string): Promise<ResultType<User>>;
	findById(id: string): Promise<ResultType<User>>;
	findAll(): Promise<ResultType<User[]>>;
}
