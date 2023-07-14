import { z } from 'zod';

const errors = {
	code: { required: 'o código é obrigatório' },
	state: { required: 'o estado é obrigatório' },
	storedState: { required: 'o estado armazenado é obrigatório' }
};

export const signInWithOAuthProviderSchema = z.object({
	code: z.string({ required_error: errors.code.required }),
	state: z.string({ required_error: errors.state.required }),
	storedState: z.string({ required_error: errors.storedState.required })
});

export type SignInWithOAuthProviderDTO = z.infer<typeof signInWithOAuthProviderSchema>;
