import { z } from 'zod';

const errors = {
	username: { required: 'o nome de usuário é obrigatório' },
	password: { required: 'a senha é obrigatória', min: 'a senha deve ter no mínimo 8 caracteres' },
	email: { required: 'o e-mail é obrigatório', invalid: 'e-mail inválido' },
	name: { required: 'o nome é obrigatório' },
	refined: 'o nome de usuário e a senha são obrigatórios'
};

export const signUpWithUsernameSchema = z
	.object({
		username: z.string({ required_error: errors.username.required }).nonempty().min(3),
		password: z.string({ required_error: errors.password.required }).nonempty().min(8),
		email: z.string().email({ message: errors.email.invalid }).nonempty().min(3, { message: errors.email.required }),
		name: z.string({ required_error: errors.name.required }).optional()
	})
	.refine(
		(data) => {
			const lowerCasePassword = data.password.toLowerCase();
			const emailLowerCase = data.email.toLowerCase();
			const lowerCaseUsername = data.username.toLowerCase();

			if (lowerCasePassword.includes(lowerCaseUsername) || lowerCaseUsername.includes(lowerCasePassword)) {
				return false;
			}

			if (emailLowerCase.includes(lowerCasePassword) || lowerCasePassword.includes(emailLowerCase)) {
				return false;
			}

			return true;
		},
		{ message: errors.refined }
	);

export type SignUpWithUsernameDTO = z.infer<typeof signUpWithUsernameSchema>;
