import { z } from 'zod';
import { emailSchema, passwordSchema } from './user-sign-up-schema';

export const userSignInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
