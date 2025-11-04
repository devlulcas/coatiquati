import { authClient } from '@/modules/auth/lib/auth-client';
import { useQuery } from '@tanstack/react-query';

const CURRENT_USER_DATA_QUERY_KEY = 'CURRENT_USER_DATA_QUERY_KEY';

export function useCurrentUserDataQuery() {
  return useQuery({
    queryKey: [CURRENT_USER_DATA_QUERY_KEY],
    queryFn: async () => {
      const session = await authClient.getSession();

      if (session.error) {
        throw new Error(session.error.message);
      }

      if (!session.data?.user) {
        throw new Error('Usuário não autenticado');
      }

      return session.data.user;
    },
  });
}
