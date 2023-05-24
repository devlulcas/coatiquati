import { z } from 'zod';

export const signInWithUsernameSchema = z.object({
	username: z.string({
		required_error: 'O nome de usuário é obrigatório.'
	}),
	password: z.string({
		required_error: 'A senha é obrigatória.'
	})
});

export type SignInWithUsernameDTO = z.infer<typeof signInWithUsernameSchema>;
