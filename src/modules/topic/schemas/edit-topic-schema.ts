import { z } from 'zod';
import { newTopicSchema } from './new-topic-schema';
import { topicWithIdSchema } from './topic-with-id-schema';

export const updateTopicSchema = newTopicSchema
  .partial()
  .merge(topicWithIdSchema)
  .merge(
    z.object({
      trailId: z.number(),
    }),
  );

export type UpdateTopicSchema = z.infer<typeof updateTopicSchema>;
