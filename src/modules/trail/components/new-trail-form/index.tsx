'use client';

import { useToast } from '@/shared/components/ui/use-toast';
import type { NewTrailSchema } from '../../schemas/new-trail-schema';
import { TrailBaseForm } from '../trail-base-form';
import { newTrailAction } from './new-trail-action';

export function NewTrailForm() {
  const { toast } = useToast();

  const onSubmit = async (data: NewTrailSchema) => {
    try {
      await newTrailAction(data);
      toast({ title: 'Trilha criada com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao criar trilha',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">Criar nova trilha</h2>
      <TrailBaseForm onSubmit={onSubmit} />
    </div>
  );
}
