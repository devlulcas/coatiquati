import { z } from 'zod';
import { isValidReportReason } from '../constants/report';

const reportSearchSchema = z.object({
  search: z.coerce.string().optional(),
  skip: z.coerce.string().optional().transform(Number),
  take: z.coerce.string().optional().transform(Number),
  reportedById: z.coerce.string().optional(),
  reportedEntityId: z.coerce.string().optional(),
  reportedEntityType: z.coerce.string().optional(),
  username: z.coerce.string().optional(),
  type: z.coerce
    .string()
    .optional()
    .refine(
      value => {
        if (typeof value === 'undefined') return true;
        return isValidReportReason(value);
      },
      { message: 'Razão de reporte inválida' },
    ),
  status: z.coerce
    .string()
    .optional()
    .refine(
      value => {
        if (typeof value === 'undefined') return true;
        const validStatuses: string[] = ['pending', 'resolved', 'rejected'];
        return validStatuses.includes(value);
      },
      { message: 'Status inválido' },
    ),
});

export type ReportSearchSchema = z.infer<typeof reportSearchSchema>;
