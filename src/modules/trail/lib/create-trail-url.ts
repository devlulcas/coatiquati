export function createTrailUrl(id: number, dashboard: boolean = false): string {
  return (dashboard ? '/dashboard' : '') + `/trails/${id}`;
}

export function createTrailCategoryUrl(name: string): string {
  return `/trails/categories/${name}`;
}
