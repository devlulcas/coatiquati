import { type z } from 'zod';
import { contentWithIdSchema } from './content-with-id-schema';
import { newContentSchema } from './new-content-schema';

export const updateContentSchema = newContentSchema.partial().merge(contentWithIdSchema);

export type UpdateContentSchema = z.infer<typeof updateContentSchema>;
