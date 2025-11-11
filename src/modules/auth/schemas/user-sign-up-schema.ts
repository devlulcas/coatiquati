import { z } from 'zod';

export const usernameSchema = z
  .string({ message: 'O nome de usuário é obrigatório' })
  .min(4, { message: 'O nome de usuário deve ter pelo menos 4 caracteres' })
  .max(31, { message: 'O nome de usuário deve ter no máximo 31 caracteres' });

export const passwordSchema = z
  .string({ message: 'A senha é obrigatória' })
  .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  .max(255, { message: 'A senha deve ter no máximo 255 caracteres' });

export const emailSchema = z.email({
  message: 'O email informado não é válido',
});

export const nameSchema = z
  .string({ message: 'O nome é obrigatório' })
  .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  .max(255, { message: 'O nome deve ter no máximo 255 caracteres' });

export const userSignUpSchema = z.object({
  name: nameSchema,
  username: usernameSchema,
  password: passwordSchema,
  email: emailSchema,
});
