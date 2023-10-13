import type { Trail } from '../types/trail';

type TrailWithCategory = [string, Trail[]];
export function groupTrailsByCategory(trails: Trail[]): TrailWithCategory[] {
  return trails.reduce((acc, trail) => {
    const category = trail.category?.name ?? 'Sem categoria';

    const categoryIndex = acc.findIndex(([categoryName]) => categoryName === category);

    if (categoryIndex === -1) {
      acc.push([category, [trail]]);
    } else {
      acc[categoryIndex][1].push(trail);
    }

    return acc;
  }, [] as TrailWithCategory[]);
}
