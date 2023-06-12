import { z } from 'zod';

export const signUpWithUsernameSchema = z.object({
	username: z
		.string({
			description: 'o nome de usuário deve ter no mínimo 3 caracteres'
		})
		.nonempty()
		.min(3),
	password: z
		.string({
			description: 'a senha deve ter no mínimo 8 caracteres'
		})
		.nonempty()
		.min(8),
	email: z.string().email('e-mail inválido'),
	name: z.string().nullable().optional()
});

export type SignUpWithUsernameDTO = z.infer<typeof signUpWithUsernameSchema>;
