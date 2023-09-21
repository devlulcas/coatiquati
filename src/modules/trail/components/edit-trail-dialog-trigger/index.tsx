'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { PencilIcon } from 'lucide-react';
import type { NewTrailSchema } from '../../schemas/new-trail-schema';
import { type Trail } from '../../types/trail';
import { TrailBaseForm } from '../trail-base-form';
import { editTrailAction } from './edit-trail-action';

type EditTrailDialogTriggerProps = {
  trail: Trail;
};

export function EditTrailDialogTrigger({ trail }: EditTrailDialogTriggerProps) {
  const { toast } = useToast();

  const onSubmit = async (data: NewTrailSchema) => {
    try {
      await editTrailAction({ trail: data, trailId: trail.id });
      toast({ title: 'Trilha editada com sucesso' });
    } catch (error) {
      toast({
        title: 'Erro ao editar trilha',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

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
          <DialogTitle className="mb-4 max-w-md truncate">
            Editar: {trail.title}
          </DialogTitle>
          <TrailBaseForm defaultValues={trail} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
