import { z } from 'zod';

export const userSignUpSchema = z.object({
  username: z.string().min(4).max(31),
  password: z.string().min(6).max(255),
  email: z.string().min(6).max(255),
});
