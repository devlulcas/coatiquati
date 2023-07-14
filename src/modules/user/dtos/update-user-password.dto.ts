import { z } from 'zod';

const errors = {
	id: { required: 'o id é obrigatório' },
	email: { required: 'o e-mail é obrigatório', invalid: 'e-mail inválido' }
};

export const updateUserPasswordSchema = z.object({
	id: z.string({ required_error: errors.id.required }),
	email: z.string().email({ message: errors.email.invalid }).nonempty().min(3, { message: errors.email.required })
});

export type UpdateUserPasswordDTO = z.infer<typeof updateUserPasswordSchema>;
