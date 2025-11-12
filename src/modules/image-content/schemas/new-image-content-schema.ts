import { upsertBaseContentSchema } from '@/modules/content/schemas/base-content';
import { z } from 'zod';

export const newImageContentSchema = z
  .object({
    src: z.url(),
    alt: z.string(),
    description: z.string(),
  })
  .extend(upsertBaseContentSchema.shape);

export type NewImageContentSchema = z.infer<typeof newImageContentSchema>;
