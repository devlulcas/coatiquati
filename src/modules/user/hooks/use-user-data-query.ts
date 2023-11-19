import { useQuery } from '@tanstack/react-query';
import type { User } from '../types/user';

export const CURRENT_USER_DATA_QUERY_KEY = 'CURRENT_USER_DATA_QUERY_KEY';

async function fetchCurrentUser(): Promise<unknown> {
  try {
    const response = await fetch('/api/users/me');
    const data = await response.json();
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to fetch current user: ${message}`);
  }
}

export function useCurrentUserDataQuery() {
  return useQuery<User, Error>({
    queryKey: [CURRENT_USER_DATA_QUERY_KEY],
    queryFn: async () => {
      const data = await fetchCurrentUser();

      const isUserData = (data: any): data is User => {
        return typeof data === 'object' && data !== null && 'id' in data;
      };

      if (!isUserData(data)) {
        throw new Error('Invalid user data');
      }

      return data;
    },
  });
}
