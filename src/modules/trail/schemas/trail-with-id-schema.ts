import { ContentStatus } from '@/modules/database/lib/content-enum';
import { z } from 'zod';

export const trailWithIdSchema = z.object({
  id: z.number(),
  status: z.enum(ContentStatus),
});

export type TrailWithIdSchema = z.infer<typeof trailWithIdSchema>;
