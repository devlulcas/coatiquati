'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { Trail } from '../../types/trail';
import { TrailBaseForm } from '../trail-base-form';

type EditTrailDialogTriggerProps = {
  trail: Trail;
};

export function EditTrailDialogTrigger({ trail }: EditTrailDialogTriggerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          Editar
          <PencilIcon size={16} className="ml-2" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-4">Editar {trail.title}</DialogTitle>
          <DialogDescription>
            <TrailBaseForm
              defaultValues={trail}
              onSubmit={(data) => console.log(data)}
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
