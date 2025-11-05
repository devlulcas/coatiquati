import { useToast } from '@/shared/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { upsertTrailMutation } from '../actions/upsert-trail-mutation';

export function useUpsertTrail() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: upsertTrailMutation,
    onSuccess: () => {
      toast({ title: 'Trilha modificada com sucesso', variant: 'success' });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao modificar trilha',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
