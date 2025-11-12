import { z } from 'zod';

export const trailWithIdSchema = z.object({
  id: z.number(),
});

export type TrailWithIdSchema = z.infer<typeof trailWithIdSchema>;
