import { z } from 'zod';

export const signInWithOAuthProviderSchema = z.object({
	code: z.string({
		required_error: 'O código é obrigatório.'
	}),
	state: z.string({
		required_error: 'O estado é obrigatório.'
	}),
	storedState: z.string({
		required_error: 'O estado armazenado é obrigatório.'
	})
});

export type SignInWithOAuthProviderDTO = z.infer<typeof signInWithOAuthProviderSchema>;
