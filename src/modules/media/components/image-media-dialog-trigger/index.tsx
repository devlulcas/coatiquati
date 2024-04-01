'use client';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { ImagePlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ImageMediaBaseForm, type ImageMediaFormValues } from '../image-media-base-form';

type ImageMediaDialogTriggerProps = {
  onSubmit: (data: ImageMediaFormValues) => void | Promise<void>;
  defaultValues?: Partial<ImageMediaFormValues>;
};

export function ImageMediaDialogTrigger({ onSubmit, defaultValues }: ImageMediaDialogTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const wrappedOnSubmit = useCallback(
    async (data: ImageMediaFormValues) => {
      await onSubmit(data);
      setIsOpen(false);
    },
    [onSubmit],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-center gap-2">
          <ImagePlusIcon /> Contribuir com uma imagem
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <ImageMediaBaseForm defaultValues={defaultValues} onSubmit={wrappedOnSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
