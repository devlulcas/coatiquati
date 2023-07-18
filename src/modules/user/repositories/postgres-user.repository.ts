import { db } from '$lib/server/db';
import { getLimitAndOffset } from '$lib/types/pagination';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { and, eq, ilike, inArray } from 'drizzle-orm';
import type { UsersSearchSchema } from '../dtos/users-search.dto';
import { authUserTable } from '../schemas/auth-user';
import type { User, UserId } from '../types/user';
import type { UserRepository } from './user.repository';

export class PostgresUserRepository implements UserRepository {
	async findByEmail(email: string): Promise<ResultType<User>> {
		const users = await db.select().from(authUserTable).where(eq(authUserTable.email, email));

		const user = users[0];

		if (!user) {
			return Fail('User not found');
		}

		return Ok(user);
	}

	async findById(id: UserId): Promise<ResultType<User>> {
		const users = await db.select().from(authUserTable).where(eq(authUserTable.id, id));

		const user = users[0];

		if (!user) {
			return Fail('User not found');
		}

		return Ok(user);
	}

	async findMany(params: UsersSearchSchema): Promise<ResultType<User[]>> {
		const { limit, offset } = getLimitAndOffset(params);

		const permittedRoles: string[] = typeof params.role === 'string' ? [params.role] : [];
		const username = `%${params.username}%`;
		const email = `%${params.email}%`;

		const clearParams = [
			params.role ? inArray(authUserTable.roles, [permittedRoles]) : undefined,
			params.username ? ilike(authUserTable.username, username) : undefined,
			params.email ? ilike(authUserTable.email, email) : undefined,
			params.banned ? eq(authUserTable.active, params.banned) : undefined
		].filter(Boolean);

		const users = await db
			.select()
			.from(authUserTable)
			.where(and(...clearParams))
			.limit(limit)
			.offset(offset);

		return Ok(users ?? []);
	}

	async update(id: UserId, data: Partial<User>): Promise<ResultType<User>> {
		const users = await db.select().from(authUserTable).where(eq(authUserTable.id, id));

		const user = users[0];

		if (!user) {
			return Fail('User not found');
		}

		const updatedUser = await db.update(authUserTable).set(data).where(eq(authUserTable.id, id)).returning();

		return Ok(updatedUser[0]);
	}
}
