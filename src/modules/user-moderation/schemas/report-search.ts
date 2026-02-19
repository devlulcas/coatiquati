import { ReportReason, ReportStatus } from '@/modules/database/lib/report-enum';
import { z } from 'zod';

const reportSearchSchema = z.object({
  search: z.coerce.string().optional(),
  skip: z.coerce.string().optional().transform(Number),
  take: z.coerce.string().optional().transform(Number),
  reportedById: z.coerce.string().optional(),
  reportedEntityId: z.coerce.string().optional(),
  type: z.enum(ReportReason).optional(),
  status: z.enum(ReportStatus).optional(),
});

export type ReportSearchSchema = z.infer<typeof reportSearchSchema>;
