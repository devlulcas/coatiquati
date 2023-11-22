import { type z } from 'zod';
import { contentWithIdSchema } from '@/modules/content/schemas/content-with-id-schema';
import { newContentSchema } from '@/modules/content/schemas/new-content-schema';
import { newRichTextContentSchema } from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';

export const updateRichTextContentSchema = newRichTextContentSchema
  .partial()
  .merge(newContentSchema.partial().merge(contentWithIdSchema));

export type UpdateRichTextContentSchema = z.infer<typeof updateRichTextContentSchema>;
