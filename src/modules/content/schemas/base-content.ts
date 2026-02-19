import { ContentStatus } from '@/modules/database/lib/content-enum';
import { z } from 'zod';

export const upsertBaseContentSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(1).max(180).trim(),
  description: z.string().min(1).max(1000).trim(),
  status: z.enum(ContentStatus).default(ContentStatus.DRAFT),
  topicId: z.number().int().positive(),
  authorId: z.string(),
});
