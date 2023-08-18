import { z } from 'zod';
import { newTrailSchema } from './new-trail-schema';

export const updateTrailUseCaseSchema = z.object({
  trailId: z.number({ required_error: 'O ID da trilha é obrigatório.' }),
  trail: newTrailSchema.partial(),
});

export type UpdateTrailSchema = z.infer<typeof updateTrailUseCaseSchema>;
