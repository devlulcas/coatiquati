export function isWithinExpiration(expiration: number): boolean {
  const now = Date.now();
  return now < expiration;
}
