import { z } from 'zod';
import { userSignUpSchema } from '@/modules/auth/schemas/user-sign-up-schema';

export const updateUserSchema = userSignUpSchema.omit({ password: true }).extend({
  avatar: z.string().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
