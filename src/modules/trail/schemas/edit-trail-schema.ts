import { z } from 'zod';
import { newTrailSchema } from './new-trail-schema';
import { trailWithIdSchema } from './trail-with-id-schema';

export const updateTrailUseCaseSchema = newTrailSchema.partial().merge(trailWithIdSchema);

export type UpdateTrailSchema = z.infer<typeof updateTrailUseCaseSchema>;
