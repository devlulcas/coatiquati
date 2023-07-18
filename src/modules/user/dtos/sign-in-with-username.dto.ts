import { z } from 'zod';

const errors = {
	username: { required: 'o nome de usuário é obrigatório' },
	password: { required: 'a senha é obrigatória', min: 'a senha deve ter no mínimo 8 caracteres' }
};

export const signInWithUsernameSchema = z.object({
	username: z.string({ required_error: errors.username.required }),
	password: z.string({ required_error: errors.password.required }).min(8, { message: errors.password.min })
});

export type SignInWithUsernameSchema = z.infer<typeof signInWithUsernameSchema>;
