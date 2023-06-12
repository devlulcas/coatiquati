import { z } from 'zod';

export const signInWithOAuthProviderSchema = z.object({
	code: z.string({
		required_error: 'o código é obrigatório'
	}),
	state: z.string({
		required_error: 'o estado é obrigatório'
	}),
	storedState: z.string({
		required_error: 'o estado armazenado é obrigatório'
	})
});

export type SignInWithOAuthProviderDTO = z.infer<typeof signInWithOAuthProviderSchema>;
