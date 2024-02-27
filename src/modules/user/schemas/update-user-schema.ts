import { userSignUpSchema } from '@/modules/auth/schemas/user-sign-up-schema';
import { z } from 'zod';

export const updateUserSchema = userSignUpSchema.omit({ password: true }).extend({
  avatar: z.string().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
