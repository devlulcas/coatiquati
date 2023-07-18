import { paginationSchemaShape } from '$lib/types/pagination';
import { z } from 'zod';

export const usersSearchSchema = z.object({
	...paginationSchemaShape,
	role: z.string().nullish(),
	username: z.string().nullish(),
	email: z.string().nullish(),
	banned: z.coerce.boolean().nullish().default(false)
});

export type UsersSearchSchema = z.infer<typeof usersSearchSchema>;
