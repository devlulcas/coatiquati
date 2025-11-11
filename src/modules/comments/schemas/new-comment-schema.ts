import { z } from 'zod';

export const newCommentSchema = z.object({
  content: z.string(),
  parentCommentId: z.number().optional().nullable(),
  trailId: z.number().optional().nullable(),
  topicId: z.number().optional().nullable(),
  contentId: z.number().optional().nullable(),
  publicationId: z.number().optional().nullable(),
});

export type NewCommentSchema = z.infer<typeof newCommentSchema>;
