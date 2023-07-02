import { paginationSchemaShape } from '$lib/types/pagination';
import { z } from 'zod';

export const listUsersSchema = z.object({
	...paginationSchemaShape,
	role: z.string().nullish(),
	username: z.string().nullish(),
	email: z.string().nullish(),
	banned: z.coerce.boolean().nullish().default(false)
});

export type ListUsersDTO = z.infer<typeof listUsersSchema>;
