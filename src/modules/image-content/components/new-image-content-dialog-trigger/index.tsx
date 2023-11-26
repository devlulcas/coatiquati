'use client';

import { ImageContentBaseForm } from '@/modules/image-content/components/image-content-base-form';
import type { NewImageContentSchema } from '@/modules/image-content/schemas/new-image-content-schema';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/shared/components/ui/dialog';
import { useToast } from '@/shared/components/ui/use-toast';
import { useState } from 'react';
import { newImageContentAction } from './new-image-content-action';

type NewImageContentDialogTriggerProps = {
  topicId: number;
  children: React.ReactNode;
};

export function NewImageContentDialogTrigger({ topicId, children }: NewImageContentDialogTriggerProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: NewImageContentSchema) => {
    try {
      await newImageContentAction(data);
      toast({ title: 'Conteúdo de imagem criado com sucesso' });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao criar conteúdo de imagem criado',
        description: error instanceof Error ? error.message : String(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="min-w-fit">
        <DialogHeader>
          <ImageContentBaseForm defaultValues={{ topicId }} onSubmit={onSubmit} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
