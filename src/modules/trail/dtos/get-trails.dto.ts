import { paginationSchemaShape } from '$lib/types/pagination';
import { z } from 'zod';

const errors = {
	orderBy: 'orderBy deve ser "created_at" ou "updated_at"',
	order: 'order deve ser "asc" ou "desc"'
};

export const getTrailsSchema = z.object({
	...paginationSchemaShape,
	search: z.string().optional(),
	orderBy: z.enum(['created_at', 'updated_at'], { invalid_type_error: errors.orderBy }).optional(),
	order: z.enum(['asc', 'desc'], { invalid_type_error: errors.order }).optional()
});

export type GetTrailsDTO = z.infer<typeof getTrailsSchema>;
