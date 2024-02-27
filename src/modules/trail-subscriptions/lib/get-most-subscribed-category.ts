import type { Trail } from '@/modules/trail/types/trail';

export function getMostSubscribedCategory(subscribedTrails: Pick<Trail, 'category'>[]): string | null {
  const subscriptionsByCategory = subscribedTrails.reduce(
    (acc, trail) => {
      if (trail.category) {
        const category = trail.category.name;

        if (!acc[category]) {
          acc[category] = 0;
        }

        acc[category] += 1;
      }

      return acc;
    },
    {} as Record<string, number>,
  );

  const mostSubscribedCategory = Object.keys(subscriptionsByCategory).reduce((a, b) => {
    return subscriptionsByCategory[a] > subscriptionsByCategory[b] ? a : b;
  }, '');

  return mostSubscribedCategory ? mostSubscribedCategory : null;
}
