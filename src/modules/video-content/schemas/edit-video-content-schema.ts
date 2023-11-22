import { contentWithIdSchema } from '@/modules/content/schemas/content-with-id-schema';
import { newContentSchema } from '@/modules/content/schemas/new-content-schema';
import { newVideoContentSchema } from '@/modules/video-content/schemas/new-video-content-schema';
import { type z } from 'zod';

export const updateVideoContentSchema = newVideoContentSchema
  .partial()
  .merge(newContentSchema.partial().merge(contentWithIdSchema));

export type UpdateVideoContentSchema = z.infer<typeof updateVideoContentSchema>;
