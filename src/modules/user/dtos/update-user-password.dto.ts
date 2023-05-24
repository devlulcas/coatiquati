import { z } from 'zod';
import { signUpWithUsernameSchema } from './sign-up-with-username.dto';

export const updateUserPasswordSchema = z.object({
	id: z.string({
		required_error: 'O id é obrigatório.'
	}),
	email: signUpWithUsernameSchema.shape.email
});

export type UpdateUserPasswordDTO = z.infer<typeof updateUserPasswordSchema>;
