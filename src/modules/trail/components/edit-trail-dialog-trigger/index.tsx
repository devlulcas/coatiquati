'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useUpsertTrail } from '../../hooks/use-upsert-trail';
import type { Trail } from '../../types/trail';
import { TrailBaseForm } from '../trail-base-form';

type EditTrailDialogTriggerProps = {
  trail: Trail;
};

export function EditTrailDialogTrigger({ trail }: EditTrailDialogTriggerProps) {
  const mutation = useUpsertTrail();

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
          <TrailBaseForm
            defaultValues={trail}
            onSubmit={(data) => {
              return mutation.mutateAsync({ ...data, id: trail.id });
            }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
