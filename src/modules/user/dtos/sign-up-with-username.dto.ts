import { z } from 'zod';

const errors = {
	username: { required: 'o nome de usuário é obrigatório' },
	password: { required: 'a senha é obrigatória', min: 'a senha deve ter no mínimo 8 caracteres' },
	email: { required: 'o e-mail é obrigatório', invalid: 'e-mail inválido' },
	name: { required: 'o nome é obrigatório' },
	refined: 'a senha não pode conter o nome de usuário ou o e-mail'
};

export const signUpWithUsernameSchema = z
	.object({
		username: z.string({ required_error: errors.username.required }).nonempty().min(3),
		name: z.string({ required_error: errors.name.required }).optional(),
		email: z.string().email({ message: errors.email.invalid }).nonempty().min(3, { message: errors.email.required }),
		password: z.string({ required_error: errors.password.required }).nonempty().min(8)
	})
	.refine(
		(data) => {
			const lowerCasePassword = data.password.toLowerCase();
			const emailLowerCase = data.email.toLowerCase();
			const lowerCaseUsername = data.username.toLowerCase();

			const passwordIncludesUsername = lowerCasePassword.includes(lowerCaseUsername);
			const passwordIncludesEmail = lowerCasePassword.includes(emailLowerCase);

			return !passwordIncludesUsername && !passwordIncludesEmail;
		},
		{ message: errors.refined }
	);

export type SignUpWithUsernameDTO = z.infer<typeof signUpWithUsernameSchema>;
