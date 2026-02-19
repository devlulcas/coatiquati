import { ReportReason } from '@/modules/database/lib/report-enum';
import { z } from 'zod';

export const createReportSchema = z.object({
  description: z.string(),
  userId: z.string(),
  type: z.enum(ReportReason),
  commentId: z.number().optional(),
  contentId: z.number().optional(),
  publicationId: z.number().optional(),
  trailId: z.number().optional(),
  topicId: z.number().optional(),
});

export type CreateReportSchema = z.infer<typeof createReportSchema>;
