import type { z } from 'zod';
import { upsertTrailSchema } from './new-trail-schema';
import { trailWithIdSchema } from './trail-with-id-schema';

export const updateTrailSchema = upsertTrailSchema
  .partial()
  .merge(trailWithIdSchema);

export type UpdateTrailSchema = z.infer<typeof updateTrailSchema>;
