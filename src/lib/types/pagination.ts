import type { Nullish } from './nullish';

export type Pagination = {
	limit: number;
	page: number;
};

export function calculatePagination(pagination: Nullish<Pagination>): {
	offset: number;
	limit: number;
} {
	const { page, limit } = pagination;

	const parsedPage = page ? parseInt(page.toString()) : 1;
	const parsedLimit = limit ? parseInt(limit.toString()) : 10;

	return {
		offset: (parsedPage - 1) * parsedLimit,
		limit: parsedLimit
	};
}
