import { z } from 'zod';
import { newContentSchema } from './new-content-schema';

export const newRichTextContentSchema = newContentSchema.merge(
  z.object({
    content: z.any(),
  }),
);

export type NewRichTextContentSchema = z.infer<typeof newRichTextContentSchema>;
