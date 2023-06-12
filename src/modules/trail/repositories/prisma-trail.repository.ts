import { prisma } from '$lib/server/prisma';
import { calculatePagination, type Pagination } from '$lib/types/pagination';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import type { CreateTrailDTO } from '../dtos/create-trail.dto';
import type { TrailPreview } from '../dtos/trail-preview.dto';
import type { FindManyTrailsParams, NewTrail, TrailRepository } from './trail.repository';

export class PrismaTrailRepository implements TrailRepository {
	async create(trail: NewTrail): Promise<ResultType<TrailPreview>> {
		try {
			const createdTrail = await prisma.trail.create({
				data: {
					...trail,
					author: {
						connect: {
							id: trail.authorId
						}
					}
				},
				include: {
					author: {
						select: {
							id: true,
							username: true,
							avatar: true
						}
					}
				}
			});

			return Ok(createdTrail);
		} catch (error) {
			return Fail('Erro ao criar trilha');
		}
	}

	async findMany(
		params: FindManyTrailsParams,
		pagination: Pagination
	): Promise<ResultType<TrailPreview[]>> {
		const correctPagination = calculatePagination(pagination);

		const trails = await prisma.trail.findMany({
			skip: correctPagination.skip,
			take: correctPagination.take,
			where: {
				author: {
					id: params.author
				},
				title: {
					contains: params.title
				},
				slug: {
					contains: params.slug
				}
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						avatar: true
					}
				}
			}
		});

		return Ok(trails);
	}
}
