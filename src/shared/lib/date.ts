export function toMilliseconds(
  n: number,
  t: 'secs' | 'mins' | 'hours' | 'days' | 'months',
): number {
  const conversions: Record<string, number> = {
    secs: 1000,
    mins: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
  };

  if (!conversions[t]) {
    throw new Error(`Invalid time unit: ${t}`);
  }

  return n * conversions[t];
}
