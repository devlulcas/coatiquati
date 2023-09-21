export function createTrailUrl(id: number, dashboard: boolean = false): string {
  return (dashboard ? '/dashboard' : '') + `/trails/${id}`;
}
