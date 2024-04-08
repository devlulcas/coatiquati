import { z } from 'zod';
import { isValidReportReason } from '../constants/report';

export const createReportSchema = z.object({
  type: z.string().refine(value => isValidReportReason(value), {
    message: 'Razão de reporte inválida',
  }),
  userId: z.string({
    required_error: 'ID do usuário inválido',
  }),
  reportedEntityId: z.number({
    required_error: 'ID da entidade reportada inválido',
  }),
  reportedEntityType: z.union(
    [z.literal('trail'), z.literal('topic'), z.literal('content'), z.literal('publication')],
    { required_error: 'Tipo de entidade reportada inválido' },
  ),
  description: z.string({
    required_error: 'Descrição do reporte inválida',
  }),
});

export type CreateReportSchema = z.infer<typeof createReportSchema>;
