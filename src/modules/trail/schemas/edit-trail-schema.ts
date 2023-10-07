import { z } from 'zod';
import { newTrailSchema } from './new-trail-schema';

export const updateTrailUseCaseSchema = newTrailSchema
  .partial()
  .merge(
    z.object({
      id: z.number({
        required_error: 'O ID da trilha é obrigatório.',
        invalid_type_error: 'O ID da trilha é um número',
      }),
    }),
  );

export type UpdateTrailSchema = z.infer<typeof updateTrailUseCaseSchema>;
