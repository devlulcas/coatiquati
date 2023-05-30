import { z } from 'zod';

export const listUsersDTOSchema = z.object({
	pagination: z
		.object({
			page: z.number().int().positive(),
			limit: z.number().int().positive()
		})
		.optional(),
	role: z.string().optional(),
	username: z.string().optional(),
	email: z.string().optional()
});

export type ListUsersDTO = z.infer<typeof listUsersDTOSchema>;
