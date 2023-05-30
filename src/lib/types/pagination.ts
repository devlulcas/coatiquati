export type Pagination = {
	limit: number;
	page: number;
};

export function calculatePagination(pagination: Pagination): {
	skip: number;
	take: number;
} {
	const { page, limit } = pagination;

	return {
		skip: (page - 1) * limit,
		take: limit
	};
}
