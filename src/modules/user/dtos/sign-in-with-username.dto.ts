import { z } from 'zod';

export const signInWithUsernameSchema = z.object({
	username: z.string({
		required_error: 'o nome de usuário é obrigatório'
	}),
	password: z
		.string({
			required_error: 'a senha é obrigatória'
		})
		.min(8, {
			message: 'a senha deve ter no mínimo 8 caracteres'
		})
});

export type SignInWithUsernameDTO = z.infer<typeof signInWithUsernameSchema>;
