import { z } from 'zod';
import { contentWithIdSchema } from './content-with-id-schema';
import { newContentSchema } from './new-content-schema';
import { newRichTextContentSchema } from './new-rich-text-content-schema';

export const updateRichTextContentSchema = newRichTextContentSchema.partial().merge(
  newContentSchema.partial().merge(contentWithIdSchema)
)

export type UpdateRichTextContentSchema = z.infer<typeof updateRichTextContentSchema>;
