import { Pagination, type PaginationInputDTO } from '$lib/types/pagination';
import type { TrailPreview } from '../dtos/trail.dto';
import type { TrailRepositoryInterface } from '../repositories/trail.repository';

export class GetTrails {
	constructor(private trailRepository: TrailRepositoryInterface) {}

	async execute(pagination: PaginationInputDTO): Promise<TrailPreview[]> {
		const databasePagination = Pagination.create(pagination.limit, pagination.page);

		const trails = await this.trailRepository.findAll(databasePagination);

		if (!trails) {
			throw new Error('No trails found');
		}

		return trails;
	}
}
