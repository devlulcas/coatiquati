import { db } from '$lib/server/db';
import { calculatePagination, type Pagination } from '$lib/types/pagination';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { eq, ilike, inArray, or } from 'drizzle-orm';
import type { User } from '../entities/user.entity';
import { authUser } from '../schemas/auth-user';
import type { FindManyUsersParams, UserRepository } from './user.repository';

export class PostgresUserRepository implements UserRepository {
	async findByEmail(email: string): Promise<ResultType<User>> {
		const users = await db.select().from(authUser).where(eq(authUser.email, email));

		const user = users[0];

		if (!user) {
			return Fail('User not found');
		}

		return Ok(user);
	}

	async findById(id: string): Promise<ResultType<User>> {
		const users = await db.select().from(authUser).where(eq(authUser.id, id));

		const user = users[0];

		if (!user) {
			return Fail('User not found');
		}

		return Ok(user);
	}

	async findMany(params: FindManyUsersParams, pagination: Pagination): Promise<ResultType<User[]>> {
		const { limit, offset } = calculatePagination(pagination);

		const { role, username, email } = params;

		const roleQuery = role ? inArray(authUser.roles, []) : undefined;

		const usernameQuery = username ? ilike(authUser.username, '%' + username + '%') : undefined;

		const emailQuery = email ? ilike(authUser.email, '%' + email + '%') : undefined;

		const query = [roleQuery, usernameQuery, emailQuery].filter(Boolean);

		const users = await db
			.select()
			.from(authUser)
			.where(or(...query))
			.limit(limit)
			.offset(offset);

		return Ok(users);
	}
}
