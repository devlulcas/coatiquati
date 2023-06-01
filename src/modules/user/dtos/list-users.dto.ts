import { z } from 'zod';

export const listUsersSchema = z.object({
	page: z.coerce.number().int().default(1),
	limit: z.coerce.number().int().default(10),
	role: z.string().nullish(),
	username: z.string().nullish(),
	email: z.string().nullish()
});

export type ListUsersDTO = z.infer<typeof listUsersSchema>;
