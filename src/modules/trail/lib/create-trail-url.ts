export function createTrailUrl(id: number, dashboard: boolean = false): string {
  return (dashboard ? '/dashboard' : '') + `/trails/${id}`;
}

export function createTrailCategoryUrl(id: number): string {
  return `/trails/categories/${id}`;
}
