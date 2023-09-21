import { createTrailUrl } from '@/modules/trail/lib/create-trail-url';

export function createTopicUrl(id: number, trailId: number) {
  const trailUrl = createTrailUrl(trailId);
  return `${trailUrl}/topics/${id}`;
}
