'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { useServerActionMutation } from '@/shared/hooks/use-server-action-mutation';
import { PencilIcon } from 'lucide-react';
import { updateTrailMutation } from '../../actions/update-trail-mutation';
import { type Trail } from '../../types/trail';
import { TrailBaseForm } from '../trail-base-form';

type EditTrailDialogTriggerProps = {
  trail: Trail;
};

export function EditTrailDialogTrigger({ trail }: EditTrailDialogTriggerProps) {
  const { toast } = useToast();

  const mutation = useServerActionMutation({
    serverAction: updateTrailMutation,
    onFailedAction: error => {
      toast({
        title: 'Erro ao editar trilha',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    },
    onSuccessfulAction: () => {
      toast({ title: 'Trilha editada com sucesso' });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          Editar
          <PencilIcon size={16} className="ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle className="mb-4 max-w-md truncate">Editar: {trail.title}</DialogTitle>
          <TrailBaseForm
            defaultValues={trail}
            onSubmit={data => {
              mutation.mutate({ ...data, id: trail.id });
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
