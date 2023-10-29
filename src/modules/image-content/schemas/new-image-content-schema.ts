import { newContentSchema } from '@/modules/content/schemas/new-content-schema';
import { z } from 'zod';

export const newImageContentSchema = newContentSchema.merge(
  z.object({
    src: z.string().url(),
    alt: z.string(),
    description: z.string(),
  }),
);

export type NewImageContentSchema = z.infer<typeof newImageContentSchema>;
