import { db } from '$lib/server/db';
import { calculatePagination } from '$lib/types/pagination';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { and, eq, ilike, inArray } from 'drizzle-orm';
import type { ListUsersDTO } from '../dtos/list-users.dto';
import type { User } from '../entities/user.entity';
import { authUser } from '../schemas/auth-user';
import type { UserRepository } from './user.repository';

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

	async findMany(params: ListUsersDTO): Promise<ResultType<User[]>> {
		const { limit, offset } = calculatePagination({
			page: params.page,
			limit: params.limit
		});

		const permittedRoles: string[] = typeof params.role === 'string' ? [params.role] : [];
		const username = `%${params.username}%`;
		const email = `%${params.email}%`;

		const clearParams = [
			params.role ? inArray(authUser.roles, [permittedRoles]) : undefined,
			params.username ? ilike(authUser.username, username) : undefined,
			params.email ? ilike(authUser.email, email) : undefined,
			params.banned ? eq(authUser.active, params.banned) : undefined
		].filter(Boolean);

		const users = await db
			.select()
			.from(authUser)
			.where(and(...clearParams))
			.limit(limit)
			.offset(offset);

		return Ok(users ?? []);
	}

	async update(id: string, data: Partial<User>): Promise<ResultType<User>> {
		const users = await db.select().from(authUser).where(eq(authUser.id, id));

		const user = users[0];

		if (!user) {
			return Fail('User not found');
		}

		const updatedUser = await db.update(authUser).set(data).where(eq(authUser.id, id)).returning();

		return Ok(updatedUser[0]);
	}
}