import { useQuery } from '@tanstack/react-query';
import type { PublicSession } from '../types/session';

async function fetchSession() {
  const res = await fetch('/api/auth/session');
  const json = await res.json();
  return json as PublicSession;
}

const DEFAULT_SESSION: PublicSession = {
  data: null,
  status: 'idle',
};

export function useSession() {
  const FIVE_MINUTES = 1000 * 60 * 5;

  const query = useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    refetchOnWindowFocus: true,
    refetchInterval: FIVE_MINUTES,
    refetchOnReconnect: true,
  });

  return { ...query, data: query.data ?? DEFAULT_SESSION };
}
