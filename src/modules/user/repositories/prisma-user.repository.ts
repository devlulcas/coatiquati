import { prisma } from '$lib/server/prisma';
import { calculatePagination, type Pagination } from '$lib/types/pagination';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { User } from '../entities/user.entity';
import type { FindManyUsersParams, UserRepository } from './user.repository';

export class PrismaUserRepository implements UserRepository {
	async findByEmail(email: string): Promise<ResultType<User>> {
		const user = await prisma.authUser.findUnique({
			where: {
				email: email
			}
		});

		if (!user) {
			return Fail('Usuário não encontrado.');
		}

		return Ok(user);
	}

	async update(user: Partial<User>): Promise<ResultType<User>> {
		try {
			const updatedUser = await prisma.authUser.update({
				where: { id: user.id },
				data: user
			});

			return Ok(updatedUser);
		} catch (error) {
			return Fail('Erro ao atualizar usuário.');
		}
	}

	async delete(userId: string): Promise<ResultType<User>> {
		try {
			const deletedUser = await prisma.authUser.delete({
				where: { id: userId }
			});

			return Ok(deletedUser);
		} catch (error) {
			return Fail('Erro ao deletar usuário.');
		}
	}

	async findById(id: string): Promise<ResultType<User>> {
		const user = await prisma.authUser.findUnique({
			where: { id: id }
		});

		if (!user) {
			return Fail('Usuário não encontrado.');
		}

		return Ok(user);
	}

	async findMany(params: FindManyUsersParams, pagination: Pagination): Promise<ResultType<User[]>> {
		const correctPagination = calculatePagination(pagination);
		console.log(params);
		console.log(correctPagination);

		const users = await prisma.authUser.findMany({
			skip: correctPagination.skip,
			take: correctPagination.take,
			where: {
				username: params.username ?? undefined,
				email: params.email ?? undefined,
				roles: params.role ? { has: params.role } : undefined
			}
		});

		return Ok(users);
	}
}
