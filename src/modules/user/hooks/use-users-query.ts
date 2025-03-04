import { useToast } from '@/shared/components/ui/use-toast';
import { isFail, type Result } from '@/shared/lib/result';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '../types/user';

export const USERS_QK = 'USERS_QK';

export function useUsersQuery() {
  const { toast } = useToast();

  return useQuery({
    queryKey: [USERS_QK],
    queryFn: async () => {
      const res = await fetch('/api/users');

      const json: Result<User[]> = await res.json();

      console.log(json);

      if (isFail(json)) throw new Error(json.fail);

      return json.value;
    },
    onError: err => {
      const msg = err instanceof Error ? err.message : String(err);
      toast({
        title: 'Falha ao buscar usuários!',
        description: msg,
        variant: 'destructive',
      });
    },
  });
}

export function useUsersQueryCleanup() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: [USERS_QK] });
  };
}
