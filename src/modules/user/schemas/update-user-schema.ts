import { nameSchema } from '@/modules/auth/schemas/user-sign-up-schema';
import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.optional(nameSchema),
  avatar: z.string().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
