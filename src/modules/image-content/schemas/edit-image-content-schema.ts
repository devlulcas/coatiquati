import { contentWithIdSchema } from '@/modules/content/schemas/content-with-id-schema';
import { newContentSchema } from '@/modules/content/schemas/new-content-schema';
import { newImageContentSchema } from '@/modules/image-content/schemas/new-image-content-schema';
import { type z } from 'zod';

export const updateImageContentSchema = newImageContentSchema
  .partial()
  .merge(newContentSchema.partial().merge(contentWithIdSchema));

export type UpdateImageContentSchema = z.infer<typeof updateImageContentSchema>;
