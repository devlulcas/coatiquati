import type { ResultType } from '$lib/types/result';
import type { ListUsersDTO } from '../dtos/list-users.dto';
import type { AuthUser, AuthUserId } from '../schemas/auth-user';

export interface UserRepository {
	findByEmail(email: string): Promise<ResultType<AuthUser>>;
	findById(id: AuthUserId): Promise<ResultType<AuthUser>>;
	findMany(params: ListUsersDTO): Promise<ResultType<AuthUser[]>>;
	update(id: AuthUserId, data: Partial<AuthUser>): Promise<ResultType<AuthUser>>;
}
