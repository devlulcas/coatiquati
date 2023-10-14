import { z } from 'zod';
import { newTrailSchema } from './new-trail-schema';
import { trailWithIdSchema } from './trail-with-id-schema';

export const updateTrailSchema = newTrailSchema.partial().merge(trailWithIdSchema);

export type UpdateTrailSchema = z.infer<typeof updateTrailSchema>;
