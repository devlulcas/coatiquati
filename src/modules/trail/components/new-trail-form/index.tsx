'use client';

import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { createTrailMutation } from '../../actions/create-trail-mutation';
import { TrailBaseForm } from '../trail-base-form';

export function NewTrailForm() {
  const { toast } = useToast();

  const mutation = useServerActionMutation({
    serverAction: createTrailMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao criar trilha',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({ title: 'Trilha criada com sucesso' });
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">{mutation.isPending ? "Criando" : "Criar"} nova trilha</h2>
      <TrailBaseForm onSubmit={mutation.mutate} />
    </div>
  );
}
