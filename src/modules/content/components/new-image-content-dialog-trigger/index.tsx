'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { ImagePlusIcon } from 'lucide-react';
import { ImageContentForm } from '../image-content-form';

export function NewImageContentDialogTrigger() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center justify-center">
          <ImagePlusIcon /> Contribuir com uma imagem
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <ImageContentForm onSubmit={data => console.log(data)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
