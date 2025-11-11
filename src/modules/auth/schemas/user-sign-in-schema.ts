import { z } from 'zod';
import {
  emailSchema,
  passwordSchema,
  usernameSchema,
} from './user-sign-up-schema';

export const userSignInSchema = z
  .object({
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema,
  })
  .refine((data) => data.username || data.email, {
    path: ['username', 'email'],
    message: 'Usuário ou email inválido',
  });
