import { z } from 'zod';

export const userSignUpSchema = z.object({
  username: z
    .string({ required_error: 'O nome de usuário é obrigatório' })
    .min(4, { message: 'O nome de usuário deve ter pelo menos 4 caracteres' })
    .max(31, { message: 'O nome de usuário deve ter no máximo 31 caracteres' }),
  password: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    .max(255, { message: 'A senha deve ter no máximo 255 caracteres' }),
  email: z.string({ required_error: 'O email é obrigatório' }).email({
    message: 'O email deve ser válido',
  }),
});
