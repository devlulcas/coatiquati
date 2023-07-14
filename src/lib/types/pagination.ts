import { z } from 'zod';

const errors = {
	page: { invalidType: 'a página deve ser um número inteiro positivo' },
	limit: { invalidType: 'o limite deve ser um número inteiro positivo' }
};

export const paginationSchemaShape = {
	page: z.coerce.number({ invalid_type_error: errors.page.invalidType }).int().positive().nullish(),
	limit: z.coerce.number({ invalid_type_error: errors.limit.invalidType }).int().positive().nullish()
};

export const paginationSchema = z.object(paginationSchemaShape);

export type Pagination = z.infer<typeof paginationSchema>;

export type PaginationOutput = {
	page: number;
	limit: number;
	total: number;
};

export function getLimitAndOffset(pagination: Pagination): { limit: number; offset: number } {
	const limit = pagination.limit ?? 10;
	const page = pagination.page ?? 1;
	const offset = (page - 1) * limit;

	return { limit, offset };
}
