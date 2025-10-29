import { z } from 'zod';
import { passwordSchema, usernameSchema } from './user-sign-up-schema';

export const userSignInSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});
